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

  // 퀴즈 데이터
  const quizData = [
    {
      question: '지은이는 물복 vs 딱복?',
      correctAnswer: '물복',
    },
    {
      question: '지으니의 반려견인 두리의 별명은?\n(힌트: O두리O)',
      correctAnswer: '닭두리탕',
    },
    {
      question: '메가커피시절 지은이를 놀라게 한 동물의 은어는?',
      correctAnswer: '라따뚜이',
    },
  ];

  // 현재 퀴즈 인덱스
  let currentQuizIndex = 0;

  // 퀴즈 표시 함수
  function showQuiz() {
    // 모달이 이미 있는지 확인하고 제거
    const existingModal = document.querySelector('.quiz-modal');
    if (existingModal) {
      document.body.removeChild(existingModal);
    }

    const quiz = quizData[currentQuizIndex];

    // 퀴즈 모달 생성
    const quizModal = document.createElement('div');
    quizModal.classList.add('quiz-modal');

    let quizHTML = `
      <div class="quiz-container">
        <h2>입장 퀴즈 (${currentQuizIndex + 1}/${quizData.length})</h2>
        <p class="quiz-question">${quiz.question}</p>
        <div class="quiz-answer">
          <input type="text" id="quizAnswer" placeholder="답을 입력하세요">
        </div>
        <button id="submitQuiz">제출하기</button>
      </div>
    `;

    quizModal.innerHTML = quizHTML;
    document.body.appendChild(quizModal);

    // 엔터 키 입력 시 제출
    document
      .getElementById('quizAnswer')
      .addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
          checkAnswer();
        }
      });

    // 입력란에 포커스
    document.getElementById('quizAnswer').focus();

    // 제출 버튼 이벤트 추가
    document
      .getElementById('submitQuiz')
      .addEventListener('click', checkAnswer);

    // 정답 체크 함수
    function checkAnswer() {
      const userAnswer = document.getElementById('quizAnswer').value.trim();

      if (!userAnswer) {
        alert('답을 입력해주세요!');
        return;
      }

      if (userAnswer === quiz.correctAnswer) {
        currentQuizIndex++;

        if (currentQuizIndex < quizData.length) {
          // 다음 퀴즈로 진행
          alert('정답입니다! 다음 문제로 넘어갑니다.');
          showQuiz();
        } else {
          // 모든 퀴즈를 맞췄을 때
          alert('모든 문제를 맞혔습니다! 축하 페이지로 이동합니다.');
          document.body.removeChild(quizModal);
          window.location.href = 'celebration.html';

          // 나중을 위해 인덱스 초기화
          currentQuizIndex = 0;
        }
      } else {
        alert('틀렸습니다. 다시 시도해주세요!');
        document.getElementById('quizAnswer').value = '';
        document.getElementById('quizAnswer').focus();
      }
    }
  }

  // Add click event to the button
  enterButton.addEventListener('click', function () {
    currentQuizIndex = 0; // 퀴즈 인덱스 초기화
    showQuiz();
  });
});
