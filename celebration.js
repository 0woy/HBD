document.addEventListener('DOMContentLoaded', function () {
  // 모바일 환경 확인
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // 두리 대화 관련 전역 변수
  let duriDialogueIndex = {
    1: 0,
    2: 0,
    3: 0,
  };
  let currentActiveDuri = null;

  // Confetti 설정 초기화 - 라이브러리 로딩 확인 후 실행
  if (typeof ConfettiGenerator !== 'undefined') {
    initConfetti();
  } else {
    console.warn('Confetti library not loaded, skipping confetti effects');
  }

  // 이미지 오류 처리
  handleImageErrors();

  // 두리 대화 버튼 클릭 이벤트 설정
  setupDuriButton();

  // 두리 이미지 클릭 이벤트 처리
  setupDuriInteraction();

  // Confetti 초기화 및 관리
  function initConfetti() {
    try {
      // confetti-container 요소 확인
      const confettiContainer = document.getElementById('confetti-container');

      if (!confettiContainer) {
        console.error('Confetti container not found');
        return;
      }

      // Canvas 엘리먼트 생성 및 추가
      const canvas = document.createElement('canvas');
      canvas.id = 'confetti-canvas';
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.position = 'absolute';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      confettiContainer.appendChild(canvas);

      // Initialize confetti with mobile optimizations
      const confettiSettings = {
        target: 'confetti-canvas',
        max: isMobile ? 50 : 100, // 성능 이슈 방지를 위해 수량 감소
        size: isMobile ? 0.8 : 1.2, // 크기 조정
        animate: true,
        respawn: true,
        props: ['circle', 'square'], // 단순한 도형만 사용
        colors: [
          [255, 107, 107],
          [95, 61, 196],
          [32, 201, 151],
          [254, 202, 87],
        ],
        clock: isMobile ? 35 : 30, // 모바일에서 더 느리게
        rotate: true,
        start_from_edge: true,
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // Confetti 생성
      let confetti = null;

      try {
        confetti = new ConfettiGenerator(confettiSettings);
        confetti.render();

        // 윈도우 크기 변경 처리 (디바운스 적용)
        let resizeTimeout;
        window.addEventListener('resize', function () {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(function () {
            try {
              if (confetti) {
                // 캔버스 크기 갱신
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                confetti.clear();

                // 새로운 창 크기에 맞게 설정 업데이트
                confettiSettings.width = window.innerWidth;
                confettiSettings.height = window.innerHeight;

                // 모바일 상태 체크 및 설정 조정
                const newIsMobile =
                  window.matchMedia('(max-width: 768px)').matches;
                if (newIsMobile !== isMobile) {
                  confettiSettings.max = newIsMobile ? 50 : 100;
                  confettiSettings.size = newIsMobile ? 0.8 : 1.2;
                  confettiSettings.clock = newIsMobile ? 35 : 30;
                }

                // 컨페티 다시 렌더링
                confetti.render();
              }
            } catch (err) {
              console.error('Error resizing confetti:', err);
            }
          }, 300);
        });

        // Clean up when leaving the page
        window.addEventListener('beforeunload', function () {
          try {
            if (confetti) {
              confetti.clear();
            }
          } catch (err) {
            console.error('Error clearing confetti:', err);
          }
        });

        // 모바일에서는 페이지 로드 시 컨페티 잠시 후에 표시 (초기 로딩 성능 향상)
        if (isMobile) {
          try {
            if (confetti) {
              confetti.clear();
              setTimeout(function () {
                confetti.render();
              }, 600);
            }
          } catch (err) {
            console.error('Error rendering delayed confetti:', err);
          }
        }
      } catch (renderErr) {
        console.error('Error rendering confetti:', renderErr);

        // 오류 발생 시 캔버스 제거
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
    } catch (err) {
      console.error('Failed to initialize confetti:', err);
    }
  }

  // Add a class to the body after a short delay for a fade-in effect
  setTimeout(function () {
    document.body.classList.add('loaded');
  }, 100);

  // 이미지 오류 처리 함수
  function handleImageErrors() {
    const duriImages = document.querySelectorAll('.duri-image');

    duriImages.forEach((img) => {
      // 이미지 로드 실패 시 백업 이모지 표시
      img.addEventListener('error', function () {
        // 이미지 대신 이모지 표시
        const fallbackEmoji = document.createElement('div');
        fallbackEmoji.className = 'duri-fallback';

        const duriNumber = this.closest('.duri-image-wrapper').dataset.duri;
        if (duriNumber === '1') {
          fallbackEmoji.textContent = '🐶';
        } else if (duriNumber === '2') {
          fallbackEmoji.textContent = '🐕';
        } else {
          fallbackEmoji.textContent = '🦮';
        }

        // 이미지 요소를 이모지로 대체
        this.parentNode.replaceChild(fallbackEmoji, this);
      });
    });
  }

  // 버튼 클릭 이벤트 설정 함수
  function setupDuriButton() {
    const talkToDuriButton = document.getElementById('talkToDuriButton');
    const duriInteractionContainer = document.getElementById(
      'duriInteractionContainer'
    );

    if (!talkToDuriButton || !duriInteractionContainer) {
      console.error('버튼 또는 대화 컨테이너 요소를 찾을 수 없습니다.');
      return;
    }

    // 버튼에 클릭 이벤트 추가
    talkToDuriButton.addEventListener('click', function (e) {
      // 버튼 클릭 효과 추가
      animateButtonClick(talkToDuriButton);

      // 두리 대화 컨테이너 표시
      toggleDuriInteraction();
    });

    // 버튼 클릭 애니메이션 효과
    function animateButtonClick(button) {
      button.classList.add('clicked');

      // 버튼 클릭 시 폭죽 효과
      createClickBurst(button);

      setTimeout(() => {
        button.classList.remove('clicked');
      }, 300);
    }

    // 클릭 폭죽 효과 생성
    function createClickBurst(button) {
      // 버튼 위치와 크기 가져오기
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // 폭죽 개수
      const particleCount = isMobile ? 10 : 20;

      // 폭죽 색상
      const colors = ['#ff6b6b', '#5f3dc4', '#20c997', '#feca57'];

      // 폭죽 생성
      for (let i = 0; i < particleCount; i++) {
        createParticle(
          centerX,
          centerY,
          colors[Math.floor(Math.random() * colors.length)]
        );
      }
    }

    // 각 폭죽 입자 생성
    function createParticle(x, y, color) {
      const particle = document.createElement('div');
      particle.className = 'click-particle';
      document.body.appendChild(particle);

      // 입자 스타일
      particle.style.backgroundColor = color;
      particle.style.position = 'fixed';
      particle.style.borderRadius = '50%';
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '1000';
      particle.style.opacity = '0.8';
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      // 랜덤 각도와 거리
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (isMobile ? 60 : 100) + 40;
      const velocityX = Math.cos(angle) * (Math.random() * 10 + 5);
      const velocityY = Math.sin(angle) * (Math.random() * 10 + 5);

      // 애니메이션 시작
      let posX = 0;
      let posY = 0;
      let opacity = 0.8;
      let scale = 1;

      function animate() {
        if (opacity <= 0) {
          particle.remove();
          return;
        }

        posX += velocityX;
        posY += velocityY;
        opacity -= 0.02;
        scale -= 0.01;

        particle.style.transform = `translate(calc(-50% + ${posX}px), calc(-50% + ${posY}px)) scale(${scale})`;
        particle.style.opacity = opacity;

        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }

    // 두리 대화 컨테이너 토글
    function toggleDuriInteraction() {
      // 인라인 스타일 제거 (첫 클릭 시에만 필요)
      if (duriInteractionContainer.style.display === 'none') {
        duriInteractionContainer.style.display = '';
      }

      // 가시성 토글
      setTimeout(() => {
        const isVisible = duriInteractionContainer.classList.toggle('visible');

        // 대화창으로 스크롤 (모바일)
        if (isMobile && isVisible) {
          scrollToDialogue();
        }

        // 대화창이 접힐 때 초기 상태로 복원
        if (!isVisible) {
          // 대화 텍스트 초기화
          const dialogueText = document.getElementById('dialogueText');
          if (dialogueText) {
            dialogueText.textContent =
              '두리와 대화하려면 위 이미지를 클릭하세요.';
          }

          // 두리 이미지 초기화
          const duriWrappers = document.querySelectorAll('.duri-image-wrapper');
          duriWrappers.forEach((wrapper) => {
            wrapper.style.transform = '';
          });

          // 대화 인덱스 초기화
          duriDialogueIndex = {
            1: 0,
            2: 0,
            3: 0,
          };

          // 현재 활성화된 두리 초기화
          currentActiveDuri = null;
        }
      }, 10); // 짧은 지연 후 애니메이션 시작
    }

    // 모바일 대화창으로 스크롤
    function scrollToDialogue() {
      setTimeout(() => {
        duriInteractionContainer.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 300);
    }
  }

  function setupDuriInteraction() {
    // 이미지 래퍼 요소에 직접 이벤트 연결
    const duriWrappers = document.querySelectorAll('.duri-image-wrapper');
    const dialogueText = document.getElementById('dialogueText');
    const dialogueBox = document.querySelector('.dialogue-box');
    const inventoryContainer = document.getElementById('inventoryContainer');
    const inventoryItems = document.getElementById('inventoryItems');

    // 물품 정보 (아이콘, 이름, 획득 조건)
    const items = [
      {
        id: 'letter',
        icon: '✉️',
        name: '편지 봉투',
        duriNumber: 1, // 두리1에서 얻을 수 있음
        dialogIndex: 5, // 여섯 번째 대화에서 얻음 (인덱스 5)
      },
      {
        id: 'flower',
        icon: '💐',
        name: '꽃다발',
        duriNumber: 2, // 두리2에서 얻을 수 있음
        dialogIndex: 4, // 다섯 번째 대화에서 얻음 (인덱스 4)
      },
      {
        id: 'buds',
        icon: '🎧',
        name: '버즈 케이스',
        duriNumber: 3, // 두리3에서 얻을 수 있음
        dialogIndex: 5, // 여섯 번째 대화에서 얻음 (인덱스 5)
      },
    ];

    // 획득한 물품 추적
    const acquiredItems = {};

    // 두리 대화 데이터
    const duriDialogues = {
      1: [
        '안녕하세요! 저는 두리에요.',
        '혹시 안 바쁘시면 지은이가 들고 있는 호빵을 줄 수 있나요?',
        '오늘이 지은이 생일이라 안 된다구요?',
        '그게 제가 호빵을 먹는 거랑 무슨 상관이죠?',
        '(두리가 유유히 사라진다...)',
        '두리가 있던 자리에 편지 봉투가 놓여있다.',
        '(누군가의 마음에 두리의 온기가 남아있다..)',
      ],
      2: [
        '기분 좋은 두리에요!',
        '지은이 생일인데 선물은 준비하셨을까요?',
        '아직 준비를 못했다구요?!',
        '이 꽃다발이라도 드릴테니 지은이에게 선물하세요.',
        '(두리가 꽃다발을 내민다..)',
        '(아니꼬운 시선으로 두리가 쳐다보고 있다.)',
      ],
      3: [
        '...',
        '(두리가 버즈를 꽂은 채 사색에 잠겨있다.)',
        '닭두리탕이 무슨 의미인가요?..',
        '(닭두리탕의 의미를 깨달은 두리는 잠시 생각한다.)',
        '충격적이네요..',
        '(버즈 케이스를 두고 간 채 유유히 사라진다...)',
      ],
    };

    // 두리별 대화 인덱스 추적
    // duriDialogueIndex는 이미 전역으로 선언되어 있으므로 여기서 다시 선언하지 않음

    // 현재 활성화된 두리 추적
    // currentActiveDuri도 이미 전역으로 선언되어 있으므로 여기서 다시 선언하지 않음

    // 랩퍼 요소에 클릭 이벤트 리스너 추가
    duriWrappers.forEach((wrapper) => {
      const duriNumber = wrapper.dataset.duri;

      // 모바일에서 스크롤 문제 개선 - 대화 표시 후 자동 스크롤
      function scrollToDialogue() {
        if (isMobile) {
          setTimeout(() => {
            const dialogueContainer =
              document.getElementById('dialogueContainer');
            if (dialogueContainer) {
              dialogueContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            }
          }, 200);
        }
      }

      // 모든 환경에서 클릭 이벤트 추가
      wrapper.addEventListener('click', function (e) {
        handleDuriInteraction(duriNumber, wrapper);
        scrollToDialogue();
      });

      // 모바일 터치 이벤트 추가
      if ('ontouchstart' in window) {
        wrapper.addEventListener(
          'touchend',
          function (e) {
            e.preventDefault(); // 기본 동작 방지
            handleDuriInteraction(duriNumber, wrapper);
            scrollToDialogue();
          },
          { passive: false }
        );
      }
    });

    function handleDuriInteraction(duriNumber, wrapper) {
      // 다른 두리를 클릭한 경우 이전 두리의 대화 인덱스 초기화
      if (currentActiveDuri !== null && currentActiveDuri !== duriNumber) {
        duriDialogueIndex[currentActiveDuri] = 0;
      }

      // 현재 두리를 활성 두리로 설정
      currentActiveDuri = duriNumber;

      // 현재 두리의 대화 인덱스
      let currentIndex = duriDialogueIndex[duriNumber];

      // 대화 메시지 표시
      const message = duriDialogues[duriNumber][currentIndex];

      // 물품 획득 체크
      checkItemAcquisition(duriNumber, currentIndex);

      // 다음 대화가 있는지 확인
      const hasNextMessage =
        duriDialogues[duriNumber].length > currentIndex + 1;

      // 메시지와 다음 대화 여부 전달
      showDialogue(message, hasNextMessage);

      // 다음 대화 인덱스로 업데이트 (순환)
      duriDialogueIndex[duriNumber] =
        (currentIndex + 1) % duriDialogues[duriNumber].length;

      // 클릭한 이미지에 효과 적용
      wrapper.style.transform = 'scale(0.95)';

      setTimeout(() => {
        wrapper.style.transform = '';
      }, 200);
    }

    // 물품 획득 확인 및 처리
    function checkItemAcquisition(duriNumber, dialogIndex) {
      // 해당 대화에서 얻을 수 있는 아이템 확인
      items.forEach((item) => {
        if (
          item.duriNumber === parseInt(duriNumber) &&
          item.dialogIndex === dialogIndex
        ) {
          // 아이템이 이미 획득되었는지 확인
          if (!acquiredItems[item.id]) {
            // 아이템 획득 처리
            acquiredItems[item.id] = true;

            // 인벤토리에 아이템 추가
            addItemToInventory(item);

            // 인벤토리 표시
            showInventory();

            // 아이템 획득 알림 표시
            showItemNotification(item);
          }
        }
      });
    }

    // 인벤토리에 아이템 추가
    function addItemToInventory(item) {
      const itemElement = document.createElement('div');
      itemElement.className = 'inventory-item';
      itemElement.innerHTML = `
        <span class="item-icon">${item.icon}</span>
        <span class="item-name">${item.name}</span>
      `;

      inventoryItems.appendChild(itemElement);
    }

    // 인벤토리 표시
    function showInventory() {
      if (!inventoryContainer.classList.contains('visible')) {
        inventoryContainer.classList.add('visible');
      }
    }

    // 아이템 획득 알림 표시
    function showItemNotification(item) {
      // 기존 알림 제거
      const existingNotification = document.querySelector('.item-notification');
      if (existingNotification) {
        existingNotification.remove();
      }

      // 알림 요소 생성
      const notification = document.createElement('div');
      notification.className = 'item-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <div class="notification-icon">${item.icon}</div>
          <div class="notification-text">
            <div class="notification-title">${item.name} 획득!</div>
            <div class="notification-subtitle">인벤토리에 추가되었습니다</div>
          </div>
        </div>
      `;

      // 알림을 body에 추가
      document.body.appendChild(notification);

      // 애니메이션 시작을 위한 지연
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);

      // 3초 후 알림 제거
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 500);
      }, 3000);
    }

    function showDialogue(message, hasNext = false) {
      if (!dialogueText || !dialogueBox) {
        console.error('대화창 요소를 찾을 수 없습니다!');
        return;
      }

      // 이전 애니메이션 클래스 제거
      dialogueBox.classList.remove('new-message');

      // 리플로우 트리거
      void dialogueBox.offsetWidth;

      // 다음 대화 표시기 추가
      if (hasNext) {
        dialogueText.innerHTML = `${message} <span class="next-indicator">&gt;</span>`;
      } else {
        dialogueText.textContent = message;
      }

      // 애니메이션 적용
      dialogueBox.classList.add('new-message');
    }

    // 초기 메시지 설정 - 페이지 로드 후 확인 위해 지연 실행
    setTimeout(() => {
      showDialogue(
        '두리를 클릭하면 말을 걸 수 있어요. 한 번 클릭해보세요!',
        true
      );
    }, 1000);
  }
});

// CSS를 JS로 동적 추가 (click-particle 스타일)
(function addParticleStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .special-button.clicked {
      transform: scale(0.95);
    }
    
    .click-particle {
      position: fixed;
      pointer-events: none;
      z-index: 1000;
      will-change: transform, opacity;
    }
  `;
  document.head.appendChild(style);
})();
