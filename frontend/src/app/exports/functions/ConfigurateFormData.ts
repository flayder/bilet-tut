export const ConfigurateFormData = (values: any) => {
  const data = new FormData
  for(let data$ in values) {
    if(Array.isArray(values[data$])) {
      if(values[data$].length == 1 && values[data$][0] instanceof File) {
        data.append(data$, values[data$][0])
      } else {
        let k = 0

        const arr: any = []
        values[data$].map((item: any, key: number) => {
          if(item instanceof File) {
            data.append(`${data$}${k}`, item)
            k++
          } else {
            arr.push(item)
          }
        })

        data.append(data$, JSON.stringify(arr))
      }
    } else {
      if(typeof values[data$] == "object" && !(values[data$] instanceof File))
        data.append(data$, JSON.stringify(values[data$]))
      else if (typeof values[data$] == "object" && values[data$] instanceof File)
        data.append(data$, values[data$])
      else
        data.append(data$, values[data$])
    }
  }

  return data
}