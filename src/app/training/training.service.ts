import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UiService } from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import * as Ui from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private fbSubscriptions: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UiService,
    private store: Store<fromTraining.State>
  ) { }

  fecthAvailableExercises() {
    this.store.dispatch(new Ui.StartLoading());
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
          this.store.dispatch(new Ui.StopLoading());
          this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        },
        () => {
          this.store.dispatch(new Ui.StopLoading());
          this.store.dispatch(new Training.SetAvailableTrainings(null));
          this.openSnackBar('Fetching available exercises failed, please try later.', 'red-snackbar');
        }
      )
    );
  }

  startExercise(selectId: string) {
    this.store.dispatch(new Training.StartTraining(selectId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addExerciseToDatabase({
        ...ex,
        date: new Date(),
        state: 'completed'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(ex => {
      this.addExerciseToDatabase({
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchCompletedOrCancelledExersises() {
    this.store.dispatch(new Ui.StartLoading());
    this.fbSubscriptions.push(this.db
      .collection<Exercise>('finishedExercises')
      .valueChanges()
      .subscribe(
        (exercises: Exercise[]) => {
          this.store.dispatch(new Ui.StopLoading());
          this.store.dispatch(new Training.SetFinishedTrainings(exercises));
        },
        () => {
          this.store.dispatch(new Ui.StopLoading());
          this.store.dispatch(new Training.SetFinishedTrainings(null));
          this.openSnackBar('Fetching completed or cancelled exercises failed, please try later.', 'red-snackbar');
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
    this.uiService.showSnackBar(message, className);
  }
}
