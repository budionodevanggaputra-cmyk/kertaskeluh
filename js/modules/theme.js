// FILE: js/modules/theme.js
(function () {
  function getThemeByTime() {
    var hour = new Date().getHours();
    return hour >= 6 && hour < 18 ? 'day' : 'night';
  }

  function applyTheme() {
    var currentTheme = document.documentElement.dataset.theme;
    var newTheme = getThemeByTime();
    if (currentTheme !== newTheme) {
      document.documentElement.dataset.theme = newTheme;
    }
  }

  applyTheme();

  setInterval(applyTheme, 60000);

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      applyTheme();
    }
  });
})();
