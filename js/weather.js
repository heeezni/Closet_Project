function weather(){
  const CITY = "Seoul"

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&APPID=${APIKEY}&units=metric`)
    .then((res) => res.json())
    .then(data => {
        console.log(data);
        const temp = data.main.temp;
        const condition = data.weather[0].description;
        
        document.getElementById("weather").innerHTML =
          `${temp}°C, ${condition}`;
      })
      .catch(err => {
        document.getElementById("weather").innerText = "날씨 정보를 가져올 수 없습니다.";
        console.error(err);
      });
}


