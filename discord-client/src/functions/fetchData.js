export function fetchData(url, takeData) {
    fetch(url)
    .then(response => response.json())
    .then(data => takeData(data))
    .catch((err) => {
      console.log("Error Fetching data: ", err)
      return;
    })
  }