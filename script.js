document.addEventListener('DOMContentLoaded', function () {
  const enterButton = document.getElementById('enterButton');
  const countdownElement = document.getElementById('countdown');
  const toggleFoodMenu = document.getElementById('toggleFoodMenu');
  const foodList = document.getElementById('foodList');
  const backgroundCharacters = document.getElementById('backgroundCharacters');

  // 캐릭터 배경 생성
  createCharacters();

  // 캐릭터 생성 함수
  function createCharacters() {
    // 캐릭터 개수 설정 (화면 크기에 따라 조정)
    const characterCount = Math.max(8, Math.floor(window.innerWidth / 100));

    // 기존 캐릭터 제거
    backgroundCharacters.innerHTML = '';

    // 캐릭터 생성 및 추가
    for (let i = 0; i < characterCount; i++) {
      const character = document.createElement('div');
      character.classList.add('character');

      // 랜덤 위치 설정 (왼쪽)
      const leftPos = Math.random() * 100;
      character.style.left = leftPos + '%';

      // 랜덤 크기 (30px ~ 80px)
      const size = 30 + Math.random() * 50;
      character.style.width = size + 'px';
      character.style.height = size + 'px';

      // 랜덤 애니메이션 지속 시간 (10초 ~ 30초)
      const duration = 10 + Math.random() * 20;

      // 직접 애니메이션 스타일 추가
      character.style.animation = `float ${duration}s linear infinite`;

      // 랜덤 투명도 (0.4 ~ 0.9)
      const opacity = 0.4 + Math.random() * 0.5;
      character.style.opacity = opacity;

      // 랜덤 애니메이션 딜레이
      const delay = Math.random() * 20;
      character.style.animationDelay = `-${delay}s`;

      backgroundCharacters.appendChild(character);
    }
  }

  // 윈도우 크기 변경시 캐릭터 재생성
  window.addEventListener('resize', createCharacters);

  // Set the target date: May 18, 2025 at midnight
  const targetDate = new Date('2025-05-18T00:00:00');

  // Toggle food menu
  toggleFoodMenu.addEventListener('click', function () {
    foodList.classList.toggle('open');
    toggleFoodMenu.classList.toggle('active');

    if (foodList.classList.contains('open')) {
      toggleFoodMenu.textContent = '준비된 음식 접기 -';
    } else {
      toggleFoodMenu.textContent = '준비된 음식 보기 +';
    }
  });

  // Update countdown every second
  const countdownInterval = setInterval(updateCountdown, 1000);
  updateCountdown();

  // Function to update the countdown
  function updateCountdown() {
    const currentDate = new Date();
    const timeDifference = targetDate - currentDate;

    // If the target date has passed, enable the button
    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      countdownElement.innerHTML = '입장할 수 있습니다!';
      enterButton.disabled = false;
      return;
    }

    // Calculate remaining time
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // Update countdown display
    countdownElement.innerHTML = `입장까지 남은 시간: ${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
  }

  // Add click event to the button
  enterButton.addEventListener('click', function () {
    window.location.href = 'celebration.html';
  });
});
