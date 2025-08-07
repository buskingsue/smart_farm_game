// JavaScript: 게임의 모든 로직과 상호작용을 담당합니다.

// 1. 게임 상태 변수 초기화
let temperature = 25;
let humidity = 50;
let growth = 0;
let money = 1000;
const OPTIMAL_TEMP = 22; // 최적 온도
const OPTIMAL_HUMIDITY = 65; // 최적 습도

// 2. HTML 요소 가져오기
const tempDisplay = document.getElementById('temp-display');
const humidityDisplay = document.getElementById('humidity-display');
const growthBar = document.getElementById('growth-bar');
const plantImage = document.getElementById('plant-image');
const moneyDisplay = document.getElementById('money-display');

const waterButton = document.getElementById('water-button');
const fanButton = document.getElementById('fan-button');
const harvestButton = document.getElementById('harvest-button');
const messageBox = document.getElementById('message-box');

// 3. 플레이어 액션 (버튼 클릭 이벤트)
waterButton.addEventListener('click', () => {
    if (money >= 10) {
        humidity += 15;
        money -= 10;
        showMessage("물을 주어 토양 수분이 올라갑니다.");
        updateDisplay();
    } else {
        showMessage("돈이 부족합니다!");
    }
});

fanButton.addEventListener('click', () => {
     if (money >= 20) {
        temperature -= 3;
        money -= 20;
        showMessage("팬을 켜서 온도를 낮춥니다.");
        updateDisplay();
    } else {
        showMessage("돈이 부족합니다!");
    }
});

harvestButton.addEventListener('click', () => {
    if (growth >= 100) {
        money += 200;
        growth = 0; // 초기화
        showMessage("수확 성공! +200원");
        updateDisplay();
    }
});

// 4. 게임 핵심 로직 (주기적으로 실행)
function gameLoop() {
    // 시간이 지남에 따라 자연적으로 환경 변화
    // 온도는 최적 온도로 서서히 돌아오려는 경향
    if (temperature < OPTIMAL_TEMP) temperature += 0.1;
    else if (temperature > OPTIMAL_TEMP) temperature -= 0.1;
    
    // 수분은 서서히 감소
    humidity -= 0.5;

    // 환경 조건에 따른 성장률 변화
    const tempDiff = Math.abs(temperature - OPTIMAL_TEMP);
    const humidityDiff = Math.abs(humidity - OPTIMAL_HUMIDITY);

    if (tempDiff < 5 && humidity > 50) {
        // 조건이 좋으면 성장
        growth += 0.5;
    } else {
        // 조건이 나쁘면 성장 더딤 또는 감소
        growth -= 0.1;
    }
    
    // 최소/최대값 제한
    if (growth < 0) growth = 0;
    if (growth > 100) growth = 100;
    if (humidity < 0) humidity = 0;

    // 랜덤 이벤트 (예: 가뭄)
    if (Math.random() < 0.005) { // 0.5% 확률로 발생
        humidity -= 20;
        showMessage("가뭄 발생! 토양이 빠르게 마릅니다!");
    }
    // 랜덤 이벤트 (예: 폭염)
    if (Math.random() < 0.005) { // 0.5% 확률로 발생
        temperature += 10;
        showMessage("폭염 발생! 온도가 급격히 상승합니다!");
    }

    updateDisplay();
}

// 5. 화면 업데이트 함수
function updateDisplay() {
    // 숫자 반올림하여 표시
    tempDisplay.textContent = temperature.toFixed(1);
    humidityDisplay.textContent = humidity.toFixed(1);

    // 성장률 바 및 텍스트 업데이트
    growthBar.style.width = growth + '%';
    growthBar.textContent = growth.toFixed(0) + '%';
    
    // 식물 이미지 크기 조절
    plantImage.style.width = (growth * 2) + 'px'; // 성장률에 따라 이미지 크기 변화

    // 돈 표시
    moneyDisplay.textContent = `💰 보유 자금: ${money}원`;

    // 수확 버튼 활성화/비활성화
    if (growth >= 100) {
        harvestButton.disabled = false;
    } else {
        harvestButton.disabled = true;
    }
}

// 6. 메시지 표시 함수
function showMessage(msg) {
    messageBox.textContent = msg;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000); // 3초 후에 메시지 사라짐
}

// 게임 시작
setInterval(gameLoop, 1000); // 1초마다 gameLoop 함수 실행
updateDisplay(); // 초기 화면 업데이트