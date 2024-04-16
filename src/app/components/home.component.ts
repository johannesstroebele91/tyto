import {Component, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import {MatCalendar, MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatToolbar} from '@angular/material/toolbar';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatButton, MatIconButton, MatMiniFabButton} from "@angular/material/button";
import {MatProgressBar} from "@angular/material/progress-bar";
import {Goal, UserWithGoals} from "../shared/models";
import {UsersWithGoalsService} from "../services/users-with-goals.service";
import {MatCheckbox} from "@angular/material/checkbox";
import {MatFormField, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatList, MatListItem} from "@angular/material/list";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {BehaviorSubject, Subscription, take} from "rxjs";
import {CdkTextareaAutosize, TextFieldModule} from "@angular/cdk/text-field";
import {MatSelectModule} from "@angular/material/select";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCalendar,
    MatCardContent,
    MatToolbar,
    NgIf,
    RouterLink,
    NgForOf,
    MatProgressSpinner,
    MatButton,
    MatProgressBar,
    MatCheckbox,
    MatFormField,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatList,
    MatListItem,
    MatMiniFabButton,
    ReactiveFormsModule,
    FormsModule,
    MatCardFooter,
    MatCardActions,
    CdkTextareaAutosize,
    MatFormFieldModule, MatSelectModule, MatInputModule, TextFieldModule, MatDatepicker, MatDatepickerInput, MatDatepickerToggle
  ],
  template: `
    <div style="margin-left: 30px">
      <h1>Hey {{ this.userWithGoals?.name }}!</h1>
      <h3>Here, you can view and edit your goals and add new ones.</h3>
    </div>
    <div style="display: flex;  flex-wrap: wrap">
      <!-- TODO add goal -->
      <mat-card style="width: 300px; min-height: 250px; margin: 30px; padding: 20px">
        <mat-card-content>
          <form [formGroup]="addGoalForm" (ngSubmit)="onAddGoal()">
            <mat-form-field [appearance]="'outline'" style="width: 100%">
              <mat-label>Goal</mat-label>
              <input matInput formControlName="goalName" placeholder="Insert name">
            </mat-form-field>

            <mat-form-field [appearance]="'outline'" style="width: 100%; height: auto">
              <mat-label>Description</mat-label>
              <textarea matInput cdkTextareaAutosize
                        #autosize="cdkTextareaAutosize"
                        formControlName="description" placeholder="Insert description"></textarea>
            </mat-form-field>

            <mat-form-field [appearance]="'outline'" style="width: 100%">
              <mat-label>Date</mat-label>
              <input matInput [matDatepicker]="datePicker" formControlName="date">
              <mat-datepicker-toggle matIconSuffix [for]="datePicker"></mat-datepicker-toggle>
              <mat-datepicker #datePicker></mat-datepicker>
            </mat-form-field>
            <button type="submit" mat-raised-button color="primary" aria-label="Add a goal"
                    style="width: 100%">Add Goal
            </button>
          </form>
        </mat-card-content>
      </mat-card>
      <!-- TODO display & edit goal -->
      <div *ngFor="let goal of userWithGoals?.goals">
        <mat-card style="width: 300px; min-height: 250px; margin: 30px; padding: 20px">
          <mat-list-item *ngIf="!goal.editing">
            <mat-card-header>
              <mat-card-title style="font-size: 25px; margin-bottom: 15px;">{{ goal.name }}</mat-card-title>
            </mat-card-header>
            <div style="padding-left: 16px">
              <p style="padding-top: 20px; font-weight: 500">{{ goal.description }}</p>
              <p style="padding-top: 10px">{{ goal.date }}</p>
            </div>
            <button mat-icon-button (click)="onEditGoal(goal)"
                    style="position: absolute; top: 0; right: 0; margin: 20px 20px 0 0;">
              <mat-icon>edit</mat-icon>
            </button>
          </mat-list-item>
          <mat-list-item *ngIf="goal.editing">
            <mat-card-content>
              <form [formGroup]="editGoalForm" (ngSubmit)="onEditGoal()">
                <mat-form-field [appearance]="'outline'" style="width: 100%">
                  <mat-label>Goal</mat-label>
                  <input matInput formControlName="goalName" placeholder="Insert name">
                </mat-form-field>

                <mat-form-field [appearance]="'outline'" style="width: 100%; height: auto">
                  <mat-label>Description</mat-label>
                  <textarea matInput cdkTextareaAutosize
                            #autosize="cdkTextareaAutosize"
                            formControlName="description" placeholder="Insert description"></textarea>
                </mat-form-field>

                <mat-form-field [appearance]="'outline'" style="width: 100%">
                  <mat-label>Date</mat-label>
                  <mat-label>Date</mat-label>
                  <input matInput formControlName="date" [matDatepicker]="datePicker">
                  <mat-datepicker-toggle matIconSuffix [for]="datePicker"></mat-datepicker-toggle>
                  <mat-datepicker #datePicker></mat-datepicker>

                </mat-form-field>
                <div style="display: flex; justify-content: space-around">
                  <button type="submit" mat-raised-button color="primary" aria-label="Add a goal" style="width: 45%"
                  >Save
                  </button>
                  <button type="button" (click)="cancelEdit(goal)" mat-raised-button color="warn"
                          aria-label="Add a goal" style="width: 45%"
                  >Cancel
                  </button>
                </div>
              </form>
            </mat-card-content>
          </mat-list-item>
        </mat-card>
      </div>
    </div>
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  userWithGoals!: UserWithGoals;
  addGoalForm = new FormGroup({
    goalName: new FormControl('', Validators.required),
    description: new FormControl(''),
    date: new FormControl('')
  });
  editGoalForm = new FormGroup({
    goalName: new FormControl('', Validators.required),
    description: new FormControl(''),
    date: new FormControl('')
  });
  private userWithGoalsSubject: BehaviorSubject<UserWithGoals>;
  private userWithGoalsSubscription: Subscription | undefined;

  constructor(private route: ActivatedRoute, private usersWithGoalsService: UsersWithGoalsService, private _ngZone: NgZone) {
    this.userWithGoalsSubject = new BehaviorSubject<UserWithGoals>(this.userWithGoals);
  }



  ngOnInit(): void {
    this.usersWithGoalsService.getUser(this.route.snapshot.params['id']).subscribe({
      next: (response: any) => {
        this.userWithGoals = response;
        this.userWithGoalsSubject.next(this.userWithGoals);
        console.log(this.userWithGoals)
        console.log("Getting the user was successful");
      },
      error: (error: any) => {
        console.error('Error on getting user:', error);
      }
    })

    this.userWithGoalsSubscription = this.userWithGoalsSubject.subscribe(userWithGoals => {
      if (userWithGoals) {
        this.userWithGoals = userWithGoals;
      }
    });
  }

  ngOnDestroy() {
    this.userWithGoalsSubscription?.unsubscribe();
  }

  onAddGoal() {
      const name = this.addGoalForm.value.goalName;
      const description = this.addGoalForm.value.description;
      const date = this.addGoalForm.value.date;
      if (name && description && date) {
        this.userWithGoals?.goals?.unshift({ name, description, date: new Date(date), editing: false });
        this.updateUserWithGoals();
        this.addGoalForm.reset();
      }
  }


  onEditGoal(goal?: Goal) {
    if(goal){
    goal.editing = true;
    }
  }

  saveGoal(goal: Goal) {
    goal.editing = false;
    this.updateUserWithGoals();
  }

  cancelEdit(goal: Goal) {
    goal.editing = false;
    this.editGoalForm.reset()
  }

  updateUserWithGoals() {
    this.userWithGoalsSubject.next(this.userWithGoals);
    this.usersWithGoalsService.updateUser(this.userWithGoals).subscribe({
      next: (response: any) => {
        console.log("User goals updated successfully", response);
      },
      error: (error: any) => {
        console.error('Error updating user goals:', error);
      }
    });
  }
}