import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { UserService } from "src/app/services/user.service";
import { CurrentUserType } from "../types/CurrentUserType";

export const IsAuthorizedFunction = (user$: UserService, router$: Router) => {
    const response = new Subject<CurrentUserType>()

    const checkAuth = setTimeout(() => {
        response.next(false)
    }, 10000)

    response.subscribe((isAuth) => {
      //console.log('isAuth', isAuth)
      if(!isAuth) {
        if(router$.url != '/auth')
          localStorage.setItem('previousRoute', router$.url)
        window.location.href = "/auth"
      }
    })

    user$.user.subscribe(user => {
      clearTimeout(checkAuth)
      response.next(user)
    })

    return response
}