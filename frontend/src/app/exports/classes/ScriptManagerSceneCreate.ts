import { MessageService } from "src/app/services/message.service"
import { IDateItem } from "../interfaces/IDateItem"
import { IPriceAndPlaceReference } from "../interfaces/IPriceAndPlaceReference"
import { IEventPrice } from "../interfaces/IEventPrice"
import { IEventAreaCategory } from "../interfaces/IEventAreaCategory"

declare var $: any

interface ILocalItem {
  type?: string
  id?: number,
  color?: string
}

export class ScriptManagerSceneCreate {
  id: ILocalItem = {} 
  values: IPriceAndPlaceReference[] = []
  categories: IEventAreaCategory[] = []
  dates: IDateItem[] = []

  constructor(
    private $id: string,
    private message$: MessageService
  ) {
    $(document).on('click', `#${this.$id} .custom__scene_categories input`, (el: any) => {
      const $this = $(el.target)
      const $id = parseInt($this.val())

      console.log('values', this.values)

      if(this.id.id == $id) {
        $this.prop('checked', false)

        this.id = {}
      } else {
        this.id = {
          type: $this.attr('name'),
          id: $id,
          color: $this.attr('data-color')
        }
      }

      console.log('this.id', this.id)

      if($this.attr('name') == 'date') {
        const date: IDateItem = JSON.parse($this.val())
        if(typeof date == "object" && date.hasOwnProperty('id')) {
          if(this.dates.filter(item => item.id == date.id).length == 0) {
            this.dates.push(date)
          } else {
            this.dates.map((item, key) => {
              if(item.id == date.id) {
                this.dates.splice(key, 1)
              }
            })
          }
        }
      }

      if($this.attr('name') == 'category') {
        const category: IEventAreaCategory = JSON.parse($this.val())
        if(typeof category == "object" && category.hasOwnProperty('id')) {
          if(this.categories.filter(item => item.id == category.id).length == 0) {
            this.categories.push(category)
          } else {
            this.categories.map((item, key) => {
              if(item.id == category.id) {
                this.categories.splice(key, 1)
              }
            })
          }
        }
      }
    })

    $(document).on('click', `#${this.$id} .operating`, (el:any) => {
      const $this = $(el.target)
      const id = parseInt($this.attr('data-place-id'))
      $this.css('fill', '')
      if(
        this.id.type == 'price' && 
        this.id.id && 
        this.id.id > 0 && 
        id > 0
      ) {
        //console.log('this.id111111', this.id)
        $this.css('fill', this.id.color)
        
        if($this[0].hasAttribute('data-price-id') && $this.attr('data-price-id') > 0) {
          this.values.map((i, k) => {
            if(i.place_id == id && i.price_id == parseInt($this.attr('data-price-id'))) {
              this.values.splice(k, 1)
            }
          })
        }

        $this.attr('data-price-id', this.id.id)

        this.values.push({
          price_id: this.id.id,
          place_id: id
        })

      } else {
        this.message$.handle('Для присвоения данных нужно выбрать цену и нажат на соответствующее место')
      }
    })
  }

  setPrice(data: IEventPrice[], scheme_id: number) {
    data.map((element: IEventPrice) => {
      element.place.map(place => {
        if(place.scheme.filter(i => i == scheme_id).length > 0) {
          const item = $(`#${this.$id} [data-place-id="${place.id}"]`)
          //console.log('item', item)
          if(item.length > 0) {

            this.values.push({
              place_id: place.id,
              price_id: element.id
            })

            item.attr('data-price-id', element.id)
            
            item.css('fill', element.color)
          }
        }
      })
      
    })
  }

  setDate(data: IDateItem[]) {
    this.dates = data
  }

  setCategory(data: IEventAreaCategory[]) {
    this.categories = data
  }

}