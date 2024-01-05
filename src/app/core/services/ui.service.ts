import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  public uiSubject = new BehaviorSubject<any>(false);
  constructor() { }
}
