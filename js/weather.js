function weather(){
  const API_KEY = "API_KEY";
  const CITY = "Seoul";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric&lang=kr`)
    .then(res => res.json())
    .then(data => {
        if (!data.main || !data.weather) throw new Error("날씨 데이터 없음");
        const temp = data.main.temp;
        const condition = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        document.getElementById("weather").innerHTML =
            `<img src="${iconUrl}" alt="날씨">${temp}°C, ${condition} `;
    })
    .catch(err => {
        document.getElementById("weather").innerText = "날씨 정보를 불러올 수 없습니다.";
        console.error("날씨 API 오류:", err);
    });
}

