export const GetEventLocalStorageData = () => {
    const json: any = localStorage.getItem('eventForm')
    return JSON.parse(json)
}