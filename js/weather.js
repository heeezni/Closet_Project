function weather(){
    const API_KEY = "5aee4cd036f247a996101102252605";
    const CITY = "Seoul";
    
    fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${CITY}`)
      .then(res => res.json())
      .then(data => {
        const temp = data.current.temp_c;
        const condition = data.current.condition.text;
        const icon = "https:" + data.current.condition.icon;
        
        document.getElementById("weather").innerHTML =
          `${temp}°C, ${condition} <img src="${icon}">`;
      })
      .catch(err => {
        document.getElementById("weather").innerText = "날씨 정보를 가져올 수 없습니다.";
        console.error(err);
      });

}


