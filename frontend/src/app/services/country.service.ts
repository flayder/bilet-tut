import { Injectable } from '@angular/core';
import {BilethttpService} from "./bilethttp.service";

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  constructor(private http: BilethttpService) { }


  //Получение списка стран
  getAll() {
    return this.http.get("/api/user/")
  }
}
