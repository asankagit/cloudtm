
export class Basket {
    constructor(items) {
        this.basketArr = items
    }
    /* -----------------sample obj-----------------------------------
    * [
    *     { ITEM_COUNT: 3, BASKET_ITEM: "Double room", EVENT_TYPE: "add" },
    *     { ITEM_COUNT: 2, BASKET_ITEM: "Single room", EVENT_TYPE: "add" },
    *     { ITEM_COUNT: 3, BASKET_ITEM: "Double room", EVENT_TYPE: "remove" }
    * ];
    */
    
    // get only removed items
    
    getRemovedItems() {
        const removedList = this.basketArr.filter(item => item.EVENT_TYPE === "remove")
        const result = removedList.reduce((acc, curr) => {

            if (typeof acc[curr.BASKET_ITEM] !== "undefined") {
                acc[curr.BASKET_ITEM] = (parseInt(acc[curr.BASKET_ITEM]) + parseInt(curr.ITEM_COUNT))
                return acc
            }
            else {
                acc[curr.BASKET_ITEM] = curr.ITEM_COUNT
                return acc
            }
        }, {})
       return result
    }

    // get final state

    static fetFinalStateFromBucket(obj) {
        const arr = obj 
        const reducer = (acc, curr) => {
            acc[curr.BASKET_ITEM] = curr.BASKET_ITEM
            return acc
          }
          
          const sortedRooms = arr.reduce(reducer, {})
          const finalState = []
          
          for(let roomtype in sortedRooms) {
            let tmpCount = 0
            arr.filter(r => r.BASKET_ITEM === roomtype).map(room => {
              if(room.EVENT_TYPE === "add") {
                  tmpCount = parseInt(tmpCount) + parseInt(room.ITEM_COUNT)
              }
              else if (room.EVENT_TYPE === "remove") {
                  tmpCount = parseInt(tmpCount) - parseInt(room.ITEM_COUNT)
              }
          
            })
            
              finalState.push({
                  item: roomtype,
                    count: parseInt(tmpCount)
              })
            
          }
          
          return finalState
    }
}

