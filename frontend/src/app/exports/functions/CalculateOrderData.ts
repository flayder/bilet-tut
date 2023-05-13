declare var $: any

export const CalculateOrderData = () => {
  let itemValue = 0
  $('.table_orders tbody tr').each(function(key: any, item: any){
    $(item).find('td').each(function(k: any, i: any){
      if(k == 0) {
        if($(i).find('.table__group').length > 1) {
          itemValue = $(i).find('.table__group').outerHeight() * $(i).find('.table__group').length
        }
      } else {
        if($(i).find('.table__group').length > 1)
          $(i).find('.table__group').css('height', itemValue / $(i).find('.table__group').length)
      }
    })
  })
}