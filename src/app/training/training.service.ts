import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';

import { Exercise } from './exercise.model';

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
    private db: AngularFirestore
  ) { }

  fecthAvailableExercises() {
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
        this.availableExercises = exercises;
        this.availableExercisesChanged.next([...this.availableExercises]);
        },
         error => console.log(error)
      )
    );
  }

  startExercise(selectId: string) {
    // this.db.doc('availableExercises/' + selectId).update({lastSelectedDate: new Date()});
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
    this.fbSubscriptions.push(this.db
      .collection<Exercise>('finishedExercises')
      .valueChanges()
      .subscribe(
        (exercises: Exercise[]) => {
          this.finishedExercisesChanged.next(exercises);
        },
        error => console.log(error)
      )
    );
  }

  private addExerciseToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fbSubscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
