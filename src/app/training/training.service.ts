import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';

import { Exercise } from './exercise.model';
import { UiService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  runningExerciseChanged = new Subject<Exercise>();
  availableExercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private fbSubscriptions: Subscription[] = [];

  private availableExercises: Exercise[];
  private runningExercise: Exercise;
  constructor(
    private db: AngularFirestore,
    private uiService: UiService
  ) { }

  fecthAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubscriptions.push(this.db
      .collection<Exercise>('availableExercises')
      .snapshotChanges()
      .pipe(map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
          };
        });
      }))
      .subscribe(
        (exercises: Exercise[]) => {
          this.uiService.loadingStateChanged.next(false);
          this.availableExercises = exercises;
          this.availableExercisesChanged.next([...this.availableExercises]);
          // this.openSnackBar('Fetching available exercises succeeded.', 'green-snackbar');
        },
        () => {
          this.openSnackBar('Fetching available exercises failed, please try later.', 'red-snackbar');
          this.availableExercisesChanged.next(null);
          this.uiService.loadingStateChanged.next(false);
        }
      )
    );
  }

  startExercise(selectId: string) {
    this.runningExercise = this.availableExercises.find( e => e.id === selectId );
    this.runningExerciseChanged.next({...this.runningExercise});
  }

  completeExercise() {
    this.addExerciseToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });
    this.runningExercise = null;
    this.runningExerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addExerciseToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });
    this.runningExercise = null;
    this.runningExerciseChanged.next(null);
  }

  getRunningExersise() {
    return {...this.runningExercise};
  }

  fetchCompletedOrCancelledExersises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubscriptions.push(this.db
      .collection<Exercise>('finishedExercises')
      .valueChanges()
      .subscribe(
        (exercises: Exercise[]) => {
          this.uiService.loadingStateChanged.next(false);
          this.finishedExercisesChanged.next(exercises);
          // this.openSnackBar('Fetching completed or cancelled exercises succeeded.', 'green-snackbar');
        },
        () => {
          this.uiService.loadingStateChanged.next(false);
          this.openSnackBar('Fetching completed or cancelled exercises failed, please try later.', 'red-snackbar');
          this.finishedExercisesChanged.next(null);
        }
      )
    );
  }

  private addExerciseToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    if (this.fbSubscriptions.length > 0) {
      this.fbSubscriptions.forEach(subscription => subscription.unsubscribe());
    }
  }

  openSnackBar(message: string, className: string) {
    // this.uiService.showSnackBar(message, className, null, 2000, 'right');
    this.uiService.showSnackBar(message, className);
  }
}
