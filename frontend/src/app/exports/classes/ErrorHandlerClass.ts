import {FormGroup} from "@angular/forms";
import { MessageService } from "src/app/services/message.service";
import {FORM_ERRORS} from "../constans";

export class ErrorHandlerClass {
  static process(errs: any, formErrors: any) {
    const errors = []
    if(typeof errs === "object")
      for(let key in errs) {
        if(typeof formErrors == "object" && formErrors.hasOwnProperty(key)) {
          switch (key) {
            case 'minlength' || 'maxlength':
              if(typeof errs[key] === 'object' && errs[key].hasOwnProperty('requiredLength'))
                errors.push(formErrors[key].replace(new RegExp(/@num@/g), errs[key].requiredLength))
              break
            default:
              errors.push(formErrors[key])
          }
        }
      }

    return errors
  }

  static AnyErrors(form: FormGroup) {
    let error = false
    if(typeof form.controls === "object") {
      for(let el in form.controls) {
        if(form.controls[el].errors !== null)
          error = true
      }
    }

    return error
  }

  static TryResponseFromServer(response: any, form: FormGroup, clear: boolean = false) {
    if(
      typeof response === "object" &&
      response.hasOwnProperty('error') &&
      response.error
    ) {
      for(let err in response.error) {
        if(form.controls[err] && Array.isArray(response.error[err])) {
          let k :any = `server_error_${err}`
          if(!clear) {
            let errObj: any = {
              emitEvent: true
            }
            errObj[k] = true
            response.error[err].map((e: any) => {
              FORM_ERRORS[k] = e
            })
            if(!Array.isArray(form.controls[err].errors)) {
              console.log('1', form.controls[err])
              form.controls[err].setErrors(errObj)
              console.log('2', form.controls[err])
            }
          } else {
            if(FORM_ERRORS.hasOwnProperty(err))
              delete FORM_ERRORS[k]
            if(!Array.isArray(form.controls[err].errors)) {
              console.log('here')
              form.controls[err].setErrors(null)
            }
          }
        }
      }
    }
  }

  static fileErrors(file: File, message$: MessageService) {
    let error = false
    const format: any = [
      'image/png',
      'image/jpeg',
      'image/jpg'
    ]

    if(file.size > 5000000) {
      error = true
      message$.handle('Слишком большой файл. Файл должен быть менее 5 мб', 'error')
    }

    if(!format.includes(file.type)) {
      error = true
      message$.handle('Недопустимый формат файла. Файл должен быть jpg, jpeg, png форматоми', 'error')
    }

    return error

  }
}
