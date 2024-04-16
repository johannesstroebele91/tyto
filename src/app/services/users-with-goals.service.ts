import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from "./auth.service";
import {Goal, UserWithGoals} from "../shared/models";
import {Observable} from "rxjs";

interface ResponseData {
  [key: string]: UserWithGoals;
}

const DOMAIN =
  'https://tyto-7-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_WITH_GOALS_PATH = '/usersWithGoals';

@Injectable({
  providedIn: 'root', // This makes AuthService available throughout the application
})
export class UsersWithGoalsService {
  authService = inject(AuthService);
  http = inject(HttpClient);

  createUserWithDefaultGoals(id: string, name: string): Observable<{ name: string }> {
    const goals: Goal[] = [
      {name: 'Test goal', editing: false},
    ];

    const userWithGoals: UserWithGoals = {
      id: id,
      name: name,
      goals: goals,
    }

    return this.http.put<{
      name: string;
    }>(`${DOMAIN}${USERS_WITH_GOALS_PATH}/${id}.json`, userWithGoals);
  }

  getUser(id: string): Observable<ResponseData> {
    return this.http.get<ResponseData>(`${DOMAIN}${USERS_WITH_GOALS_PATH}/${id}.json`)
  }


  updateUser(userWithGoals: UserWithGoals): Observable<any> {
    return this.http.put(`${DOMAIN}${USERS_WITH_GOALS_PATH}/${userWithGoals.id}.json`, userWithGoals);
  }
}
