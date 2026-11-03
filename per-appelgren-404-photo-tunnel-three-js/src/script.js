;(async () => {
  const { THREE, Text } = await import('https://per404.vercel.app/vendor/gallery-runtime.js')

;(() => {
  for (const link of document.querySelectorAll('.nav-link')) {
    const label = link.textContent
    const timers = new Map()
    link.setAttribute('aria-label', label)
    const letters = [...label].map((letter, index) => {
      const span = document.createElement('span')
      span.className = 'nav-letter'
      span.style.setProperty('--letter-index', index)
      span.setAttribute('aria-hidden', 'true')
      const original = document.createElement('span')
      original.textContent = letter === ' ' ? '\u00a0' : letter
      const scramble = document.createElement('span')
      scramble.className = 'nav-letter-scramble'
      span.append(original, scramble)
      return { span, original, scramble, letter }
    })
    link.replaceChildren(...letters.map(({ span }) => span))

    const restore = () => {
      timers.forEach(clearTimeout)
      timers.clear()
      for (const { original, scramble } of letters) {
        original.style.visibility = ''
        scramble.textContent = ''
      }
    }

    link.addEventListener('mouseenter', () => {
      restore()
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      letters.forEach(({ original, scramble, letter }, index) => {
        if (letter === ' ') return
        const pool = /[a-z]/i.test(letter)
          ? letter === letter.toUpperCase()
            ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            : 'abcdefghijklmnopqrstuvwxyz'
          : /\d/.test(letter) ? '0123456789' : '+-.@_/'
        let cycles = 0
        const runCycle = () => {
          if (++cycles === 3) {
            original.style.visibility = ''
            scramble.textContent = ''
            timers.delete(index)
            return
          }
          let nextLetter
          do {
            nextLetter = pool[Math.floor(Math.random() * pool.length)]
          } while (nextLetter === letter)
          original.style.visibility = 'hidden'
          scramble.textContent = nextLetter
          timers.set(index, setTimeout(runCycle, 40))
        }
        timers.set(index, setTimeout(runCycle, index * 30))
      })
    })
    link.addEventListener('mouseleave', restore)
    window.addEventListener('blur', restore)
  }

  const IMAGES = [
  'https://perappelgren.de/images/not-found/featured/beauty/vogue-czech-vision/vocue-cz-fashion-editorial-photographer-per-appelgren-2025-10.jpg',
  'https://perappelgren.de/images/not-found/featured/fashion/yung-magazine-05-2025/yung-magazine-cover-fashion-editorial-romy-nassar-photographer-per-appelgren-schierke-hottas-2025-01.jpg',
  'https://perappelgren.de/images/not-found/featured/fashion/sleek-mag-09-23/sleek-magazine-fashion-editorial-analogue-bend-the-zeitgeist-fotograf-photographer-per-appelgren-ad-studio-nonsens-2023-16.jpg',
  'https://perappelgren.de/images/not-found/featured/fashion/numero-netherlands/20231112_NUMERO_NL_02_0070_4zu5_v01.jpg',
  'https://perappelgren.de/images/not-found/featured/fashion/juun-j-x-puma-speedcat-campaign-24/juun-j-puma-speedcat-fashion-shoe-campaign-moon-photographer-per-appelgren-2024-04.jpg',
  'https://perappelgren.de/images/not-found/featured/beauty/prada-beauty-digital-campaign-2024/prada-beauty-make-up-campaign-photographer-per-appelgren-paris-2024-02.jpg',
  'https://perappelgren.de/images/not-found/featured/fashion/tetu-w-jarrod-scott/tetu-mag-jarrod-scott-fashion-editorial-photographer-per-appelgren-2025-08+copy.jpg',
  'https://perappelgren.de/images/prada-buauty/prada-buauty-01.webp',
  'https://perappelgren.de/images/prada-buauty/prada-buauty-02.webp',
  'https://perappelgren.de/images/prada-buauty/prada-buauty-03.webp',
  'https://perappelgren.de/images/prada-buauty/prada-buauty-04.webp',
  'https://perappelgren.de/images/prada-buauty/prada-buauty-05.webp',
  'https://perappelgren.de/images/prada-buauty/prada-buauty-06.webp',
  'https://perappelgren.de/images/prada-buauty/prada-buauty-07.webp',
  'https://perappelgren.de/images/speedcat/speedcat-01.webp',
  'https://perappelgren.de/images/speedcat/speedcat-02.webp',
  'https://perappelgren.de/images/speedcat/speedcat-03.webp',
  'https://perappelgren.de/images/speedcat/speedcat-04.webp',
  'https://perappelgren.de/images/speedcat/speedcat-05.webp',
  'https://perappelgren.de/images/speedcat/speedcat-06.webp',
  'https://perappelgren.de/images/speedcat/speedcat-07.webp',
  'https://perappelgren.de/images/speedcat/speedcat-08.webp',
  'https://perappelgren.de/images/speedcat/speedcat-09.webp',
  'https://perappelgren.de/images/speedcat/speedcat-10.webp',
  'https://perappelgren.de/images/tetu-mag-jarrod-scott-fashion-editorial/tetu-mag-jarrod-scott-fashion-editorial-photographer-per-appelgren-2025-07-01.webp',
  'https://perappelgren.de/images/tetu-mag-jarrod-scott-fashion-editorial/tetu-mag-jarrod-scott-fashion-editorial-photographer-per-appelgren-2025-07-02.webp',
  'https://perappelgren.de/images/tetu-mag-jarrod-scott-fashion-editorial/tetu-mag-jarrod-scott-fashion-editorial-photographer-per-appelgren-2025-07-03.webp',
  'https://perappelgren.de/images/tetu-mag-jarrod-scott-fashion-editorial/tetu-mag-jarrod-scott-fashion-editorial-photographer-per-appelgren-2025-07-04.webp',
  'https://perappelgren.de/images/tetu-mag-jarrod-scott-fashion-editorial/tetu-mag-jarrod-scott-fashion-editorial-photographer-per-appelgren-2025-07-05.webp',
  'https://perappelgren.de/images/tetu-mag-jarrod-scott-fashion-editorial/tetu-mag-jarrod-scott-fashion-editorial-photographer-per-appelgren-2025-07-06.webp',
  'https://perappelgren.de/images/tetu-mag-jarrod-scott-fashion-editorial/tetu-mag-jarrod-scott-fashion-editorial-photographer-per-appelgren-2025-07-07.webp',
  'https://perappelgren.de/images/tetu-mag-jarrod-scott-fashion-editorial/tetu-mag-jarrod-scott-fashion-editorial-photographer-per-appelgren-2025-07-08.webp',
  'https://perappelgren.de/images/the-gstaad-guy/the-gstaad-guy-01.webp',
  'https://perappelgren.de/images/the-gstaad-guy/the-gstaad-guy-02.webp',
  'https://perappelgren.de/images/the-gstaad-guy/the-gstaad-guy-03.webp',
  'https://perappelgren.de/images/the-gstaad-guy/the-gstaad-guy-04.webp',
  'https://perappelgren.de/images/the-gstaad-guy/the-gstaad-guy-05.webp',
  'https://perappelgren.de/images/the-gstaad-guy/the-gstaad-guy-06.webp',
  'https://perappelgren.de/images/the-gstaad-guy/the-gstaad-guy-07.webp',
  'https://perappelgren.de/images/video-cz/video-cz-01.webp',
  'https://perappelgren.de/images/video-cz/video-cz-02.webp',
  'https://perappelgren.de/images/video-cz/video-cz-03.webp',
  'https://perappelgren.de/images/video-cz/video-cz-04.webp',
  'https://perappelgren.de/images/video-cz/video-cz-05.webp',
  'https://perappelgren.de/images/video-cz/video-cz-06.webp',
  'https://perappelgren.de/images/video-cz/video-cz-07.webp',
  'https://perappelgren.de/images/video-cz/video-cz-08.webp',
  'https://perappelgren.de/images/video-cz/video-cz-09.webp',
  'https://perappelgren.de/images/not-found/beauty/athieng/beauty-editorial-campaign-athieng-bul-photographer-fotograf-per-appelgren-2024-01.jpg',
  'https://perappelgren.de/images/not-found/beauty/athieng/beauty-editorial-campaign-athieng-bul-photographer-fotograf-per-appelgren-2024-03.jpg',
  'https://perappelgren.de/images/not-found/beauty/hyunjong/numero-magazine-fashion-beauty-studio-editorial-print-scan-fotograf-photographer-per-appelgren-berlin-paris-19.jpg',
  'https://perappelgren.de/images/not-found/beauty/hyunjong/numero-magazine-fashion-beauty-studio-editorial-print-scan-fotograf-photographer-per-appelgren-berlin-paris-21.jpg',
  'https://perappelgren.de/images/not-found/beauty/ine/beauty-editorial-campaign-studio-photographer-per-appelgren-schierke-2025-02.jpg',
  'https://perappelgren.de/images/not-found/beauty/ine/beauty-editorial-campaign-studio-photographer-per-appelgren-schierke-2025-09.jpg',
  'https://perappelgren.de/images/not-found/beauty/madame-magazin-germany-11-2023/230906_MADAME_0404_2.jpg',
  'https://perappelgren.de/images/not-found/beauty/madame-magazin-germany-11-2023/madame-magazin-beauty-editorial-make-up-tools-skincare-fotograf-photographer-per-appelgren-paris-berlin-2023-07.jpg',
  'https://perappelgren.de/images/not-found/beauty/numero-magazine/20231112_NUMERO_NL_04_0195_v02.jpg',
  'https://perappelgren.de/images/not-found/beauty/nylon-germany-issue-11-05-23/nylon-magazine-fashion-beauty-editorial-fotograf-photographer-per-appelgren-2023-00.jpg',
  'https://perappelgren.de/images/not-found/beauty/nylon-germany-issue-11-05-23/nylon-magazine-fashion-beauty-editorial-scan-fotograf-photographer-per-appelgren-2023-06.jpg',
  'https://perappelgren.de/images/not-found/beauty/prada-beauty-digital-campaign-2024/prada-beauty-make-up-campaign-photographer-per-appelgren-paris-2024-01.jpg',
  'https://perappelgren.de/images/not-found/beauty/prada-beauty-digital-campaign-2024/prada-beauty-make-up-campaign-photographer-per-appelgren-paris-2024-04.jpg',
  'https://perappelgren.de/images/not-found/beauty/prada-holiday-digital-campaign-24/Prada_24_Fashion_Featured_Holiday_Limited_Edition_Eye-Palette_4x5+Kopie.jpg',
  'https://perappelgren.de/images/not-found/beauty/prada-holiday-digital-campaign-24/Prada_24_Fashion_Featured_Holiday_Limited_Edition_Monochrome_Mahogany_B03_701_4x5+Kopie.jpg',
  'https://perappelgren.de/images/not-found/beauty/syoss-hair-care-campaign/SYOSS-Campaign-2022-09.jpg',
  'https://perappelgren.de/images/not-found/beauty/syoss-hair-care-campaign/SYOSS-hair-care-campaign-pantone-photographer-per-appelgren-boschtobanrap-2022-01.jpg',
  'https://perappelgren.de/images/not-found/beauty/urban-alchemy-haircare-campaign/urban-alchemy-campaign-hair-shampoo-photographer-per-appelgren-schierke-2025-01.jpg',
  'https://perappelgren.de/images/not-found/beauty/urban-alchemy-haircare-campaign/urban-alchemy-campaign-hair-shampoo-photographer-per-appelgren-schierke-2025-03.jpg',
  'https://perappelgren.de/images/not-found/beauty/vogue-arabia-issue-feb-2024/Vogue-Arabia-Feb24-Beauty-opener-1.jpg',
  'https://perappelgren.de/images/not-found/beauty/vogue-arabia-issue-feb-2024/vogue-arabia-beauty-editorial-photographer-per-appelgren-schierke-hottas-03.jpg',
  'https://perappelgren.de/images/not-found/beauty/vogue-cs-12-2024-issue/vogue-cs-fashion-editorial-photographer-per-appelgren-2024-13.jpg',
  'https://perappelgren.de/images/not-found/beauty/vogue-cs-12-2024-issue/vogue-cs-fashion-editorial-photographer-per-appelgren-2024-17.jpg',
  'https://perappelgren.de/images/not-found/beauty/vogue-czech-vision/vocue-cz-fashion-editorial-photographer-per-appelgren-2025-02.jpg',
  'https://perappelgren.de/images/not-found/beauty/vogue-czech-vision/vocue-cz-fashion-editorial-photographer-per-appelgren-2025-14.jpg',
  'https://perappelgren.de/images/not-found/beauty/vogue-mariia/beauty-archive-editorial-makeup-fotograf-beautyfotograf-koeln-duesseldorf-per-florian-appelgren-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/12546228-ashley/ashley-fashion-editorial-scan-wide-angle-shades-per-appelgren-2024-berlin-paris.jpg',
  'https://perappelgren.de/images/not-found/fashion/ashley/elle-magazine-fashion-editorial-ashley-studio-scan-fotograf-photographer-per-appelgren-2023-10.jpg',
  'https://perappelgren.de/images/not-found/fashion/aurum/20250603_AURUM_MAGBOOK_0108_v01_4x5+copy.jpg',
  'https://perappelgren.de/images/not-found/fashion/aurum/20250603_AURUM_MAGBOOK_0841_v02_4x5+copy.jpg',
  'https://perappelgren.de/images/not-found/fashion/ayman/numero-magazine-fashion-beauty-studio-editorial-print-scan-fotograf-photographer-per-appelgren-berlin-paris-1.jpg',
  'https://perappelgren.de/images/not-found/fashion/ayman/numero-magazine-fashion-beauty-studio-editorial-print-scan-fotograf-photographer-per-appelgren-berlin-paris-2.jpg',
  'https://perappelgren.de/images/not-found/fashion/best-secret-black-week-24-campaign/BF24_Look_01_0054.jpg',
  'https://perappelgren.de/images/not-found/fashion/best-secret-black-week-24-campaign/BF24_Look_34_8107.jpg',
  'https://perappelgren.de/images/not-found/fashion/bill-kaulitz-x-sleek-mag-82/sleek-mag-magazine-bill-kaulitz-fashion-editorial-interview-per-appelgren-berlin-paris-2024-01+Kopie.jpg',
  'https://perappelgren.de/images/not-found/fashion/bill-kaulitz-x-sleek-mag-82/sleek-mag-magazine-bill-kaulitz-fashion-editorial-per-appelgren-berlin-paris-2024-05+Kopie.jpg',
  'https://perappelgren.de/images/not-found/fashion/casablanca-paris-ski-campaign-2025/casablanca-ski-capsule-campaign-photographer-per-appelgren-2025-00+copy.jpg',
  'https://perappelgren.de/images/not-found/fashion/casablanca-paris-ski-campaign-2025/casablanca-ski-capsule-campaign-photographer-per-appelgren-2025-07+copy.jpg',
  'https://perappelgren.de/images/not-found/fashion/casablanca-pre-fall-26-campaign/casablanca-pre-fall-campaign-fashion-photographer-per-appelgren-paris-2026-02.jpg',
  'https://perappelgren.de/images/not-found/fashion/casablanca-pre-fall-26-campaign/casablanca-pre-fall-campaign-fashion-photographer-per-appelgren-paris-2026-11.jpg',
  'https://perappelgren.de/images/not-found/fashion/chanel-cruise-collection-l-officiel-12-2023/chanel-cruise-collection-fashion-editorial-lofficiel-paris-fotograf-photographer-per-appelgren-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/chanel-cruise-collection-l-officiel-12-2023/chanel-cruise-collection-fashion-editorial-lofficiel-paris-fotograf-photographer-per-appelgren-11.jpg',
  'https://perappelgren.de/images/not-found/fashion/chanel-cruise-collection-x-aokbab-for-l-officiel/chanel-cruise-collection-aokbab-paris-fotograf-photographer-per-appelgren-2024-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/chanel-cruise-collection-x-aokbab-for-l-officiel/chanel-cruise-collection-aokbab-paris-fotograf-photographer-per-appelgren-2024-05.jpg',
  'https://perappelgren.de/images/not-found/fashion/chanel-x-actress-aokbab-for-l-officiel/chanel-cruise-collection-aokbab-paris-fotograf-photographer-per-appelgren-2024-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/chanel-x-actress-aokbab-for-l-officiel/chanel-cruise-collection-aokbab-paris-fotograf-photographer-per-appelgren-2024-05.jpg',
  'https://perappelgren.de/images/not-found/fashion/comma-international-women-s-day-campaign/503_COMMA_Womensday_Look_10_0050+1+copy.jpg',
  'https://perappelgren.de/images/not-found/fashion/comma-international-women-s-day-campaign/503_COMMA_Womensday_Look_11_0101+1+copy.jpg',
  'https://perappelgren.de/images/not-found/fashion/cosmopolitan-netherlands-cover-editorial-01-2024-with-selma-omari/20231103_COSMOPOLITAN_NL__02_0081.jpg',
  'https://perappelgren.de/images/not-found/fashion/cosmopolitan-netherlands-cover-editorial-01-2024-with-selma-omari/20231103_COSMOPOLITAN_NL__03_0337.jpg',
  'https://perappelgren.de/images/not-found/fashion/issue-magazine-01-2025/issue-magazine-fashion-editorial-kinklassic-avantgarde-photographer-per-appelgren-2025-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/issue-magazine-01-2025/issue-magazine-fashion-editorial-kinklassic-avantgarde-photographer-per-appelgren-2025-07a.jpg',
  'https://perappelgren.de/images/not-found/fashion/juun-j-x-puma-speedcat-campaign-24/juun-j-puma-speedcat-fashion-shoe-campaign-moon-photographer-per-appelgren-2024-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/juun-j-x-puma-speedcat-campaign-24/juun-j-puma-speedcat-fashion-shoe-campaign-moon-photographer-per-appelgren-2024-06.jpg',
  'https://perappelgren.de/images/not-found/fashion/l-officiel-august-2023-issue/lofficiel-melany-fashion-editorial-nyc-new-york-manhattan-fotograf-photographer-per-appelgren-boschtobanrap-2023-02.jpg',
  'https://perappelgren.de/images/not-found/fashion/l-officiel-august-2023-issue/lofficiel-melany-fashion-editorial-nyc-new-york-manhattan-fotograf-photographer-per-appelgren-boschtobanrap-2023-12.jpg',
  'https://perappelgren.de/images/not-found/fashion/l-officiel-walk-this-way/anna-milan-fashion-editorial-lofficiel-fotograf-photographer-per-appelgren-paris-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/le-mile-magazine-cover-story-s-s-2025/le-mile-magazine-cover-fashion-editorial-yulia-photographer-per-appelgren-schierke-2025-01+copy.jpg',
  'https://perappelgren.de/images/not-found/fashion/le-mile-magazine-cover-story-s-s-2025/le-mile-magazine-yulia-fashion-editorial-photographer-per-appelgren-schierke-2025-01+copy.jpg',
  'https://perappelgren.de/images/not-found/fashion/le-mile-magazine-to-the-moon/le-mile-to-the-moon-fashion-editorial-per-appelgren-2024-02.jpg',
  'https://perappelgren.de/images/not-found/fashion/le-mile-magazine-to-the-moon/le-mile-to-the-moon-fashion-editorial-per-appelgren-2024-09.jpg',
  'https://perappelgren.de/images/not-found/fashion/metal/suhyun-fashion-editorial-scan-copy-paper-folded-model-photographer-per-appelgren-berlin-paris-2023-08.jpg',
  'https://perappelgren.de/images/not-found/fashion/metal/suhyun-fashion-editorial-scan-copy-paper-folded-model-photographer-per-appelgren-berlin-paris-2023-10.jpg',
  'https://perappelgren.de/images/not-found/fashion/metamorphic-muse-for-milk/milk-ine-fashion-editorial-photographer-per-appelgren-2025.01.jpg',
  'https://perappelgren.de/images/not-found/fashion/metamorphic-muse-for-milk/milk-ine-fashion-editorial-photographer-per-appelgren-2025.09.jpg',
  'https://perappelgren.de/images/not-found/fashion/numero-netherlands-01-2024/20231112_NUMERO_NL_04_0009-Kopie-2.jpg',
  'https://perappelgren.de/images/not-found/fashion/numero-netherlands-01-2024/20231112_NUMERO_NL_05_0108-Kopie-2.jpg',
  'https://perappelgren.de/images/not-found/fashion/numero-netherlands/20231112_NUMERO_NL_01_0098-Kopie.jpg',
  'https://perappelgren.de/images/not-found/fashion/numero-netherlands/20231112_NUMERO_NL_02_0203_v01.jpg',
  'https://perappelgren.de/images/not-found/fashion/perspectives/robe-male-fashion-editorial-campaign-copy-paper-scan-model-photographer-per-appelgren-berlin-paris-2023-43.jpg',
  'https://perappelgren.de/images/not-found/fashion/perspectives/robe-male-fashion-editorial-campaign-copy-paper-scan-model-photographer-per-appelgren-berlin-paris-2023-47.jpg',
  'https://perappelgren.de/images/not-found/fashion/prada-fragrance-digital-campaign-2024/prada-beauty-fragrance-campaign-photographer-per-appelgren-paris-2024-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/prada-fragrance-digital-campaign-2024/prada-beauty-fragrance-campaign-photographer-per-appelgren-paris-2024-03.jpg',
  'https://perappelgren.de/images/not-found/fashion/prestige-magazine-haute-couture/prestige-magazine-fashion-editorial-haute-couture-fotograf-photographer-per-florian-appelgren-k_ln-berlin-paris-boschtobanrap-2022-019.jpg',
  'https://perappelgren.de/images/not-found/fashion/prestige-magazine-haute-couture/prestige-magazine-fashion-editorial-haute-couture-fotograf-photographer-per-florian-appelgren-k_ln-berlin-paris-boschtobanrap-2022-07.jpg',
  'https://perappelgren.de/images/not-found/fashion/rim/rim-fashion-editorial-print-scan-studio-per-appelgren-photographer-2023-13.jpg',
  'https://perappelgren.de/images/not-found/fashion/rim/rim-fashion-editorial-print-scan-studio-per-appelgren-photographer-2023-16.jpg',
  'https://perappelgren.de/images/not-found/fashion/roob-mood/robe-male-fashion-editorial-campaign-copy-paper-scan-model-photographer-per-appelgren-berlin-paris-2023-03.jpg',
  'https://perappelgren.de/images/not-found/fashion/roob-mood/robe-male-fashion-editorial-campaign-copy-paper-scan-model-photographer-per-appelgren-berlin-paris-2023-13.jpg',
  'https://perappelgren.de/images/not-found/fashion/selfcult/patricia-fashion-editorial-scan-halftone-y2k-fotograf-photographer-per-appelgren-paris-berlin-boschtobanrap-2023-05.jpg',
  'https://perappelgren.de/images/not-found/fashion/shades-shapes-sicky-mag/shades-shapes-fashion-editorial-photographer-per-appelgren-02+Kopie.jpg',
  'https://perappelgren.de/images/not-found/fashion/shades-shapes-sicky-mag/shades-shapes-fashion-editorial-photographer-per-appelgren-11a+Kopie.jpg',
  'https://perappelgren.de/images/not-found/fashion/sicky-mag-09-24/shades-shapes-fashion-editorial-photographer-per-appelgren-02+Kopie.jpg',
  'https://perappelgren.de/images/not-found/fashion/sicky-mag-09-24/shades-shapes-fashion-editorial-photographer-per-appelgren-11a+Kopie.jpg',
  'https://perappelgren.de/images/not-found/fashion/sleek-mag-09-23/sleek-magazine-fashion-editorial-analogue-bend-the-zeitgeist-fotograf-photographer-per-appelgren-ad-studio-nonsens-2023-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/sleek-mag-09-23/sleek-magazine-fashion-editorial-analogue-bend-the-zeitgeist-fotograf-photographer-per-appelgren-ad-studio-nonsens-2023-17.jpg',
  'https://perappelgren.de/images/not-found/fashion/tetu-w-jarrod-scott/tetu-mag-jarrod-scott-fashion-editorial-photographer-per-appelgren-2025-08+copy.jpg',
  'https://perappelgren.de/images/not-found/fashion/the-gstaad-guy-x-yung-x-audemars-piguet-01-2026/gstaad-guy-yung-magazine-cover-editorial-audemars-piguet-per-appelgren-2025-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/the-gstaad-guy-x-yung-x-audemars-piguet-01-2026/gstaad-guy-yung-magazine-cover-editorial-audemars-piguet-per-appelgren-2025-05.jpg',
  'https://perappelgren.de/images/not-found/fashion/vogue-cs-december-24-issue-walk-don-t-walk/vogue-cs-fashion-editorial-photographer-per-appelgren-2024-05.jpg',
  'https://perappelgren.de/images/not-found/fashion/vogue-cs-december-24-issue-walk-don-t-walk/vogue-cs-fashion-editorial-photographer-per-appelgren-2024-18.jpg',
  'https://perappelgren.de/images/not-found/fashion/vogue-czech-august-2025-issue/vocue-cz-fashion-editorial-photographer-per-appelgren-2025-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/vogue-czech-august-2025-issue/vocue-cz-fashion-editorial-photographer-per-appelgren-2025-22.jpg',
  'https://perappelgren.de/images/not-found/fashion/yung-magazine-05-2025/yung-magazine-cover-fashion-editorial-romy-nassar-photographer-per-appelgren-schierke-hottas-2025-01.jpg',
  'https://perappelgren.de/images/not-found/fashion/zara-larsson-x-cosmopolitan-cover-editorial/cosmopolitan-zara-larsson-photographer-per-appelgren-2026-00+copy-02.jpg',
  'https://perappelgren.de/images/not-found/fashion/zara-larsson-x-cosmopolitan-cover-editorial/cosmopolitan-zara-larsson-photographer-per-appelgren-2026-05+copy.jpg',
]

  const HOME_URL = 'https://perappelgren.de/'

  const CAMERA_Z = 8
  const CAMERA_FOV = 55
  const FAR_Z = -100
  const NEAR_Z = 12
  const TOTAL_DEPTH = NEAR_Z - FAR_Z
  const WALL_DISTANCE = 4.5
  const SCROLL_SPEED = 0.4
  const AUTO_FORWARD_SPEED = 0.02
  const MOUSE_SMOOTHING = 0.08
  const CENTER_VOID_START_Z = -24
  const CENTER_VOID_FADE_DEPTH = 10
  const SCENE_TEXT_Z = -30
  const PAPER_GLOSS_IDLE = 0.18
  const PAPER_GLOSS_NARROW = 0.08
  const DEFAULT_IMAGE_ASPECT = 0.75
  const BASE_VISIBLE_CARDS = 40
  const TOTAL_CARDS = 84
  const CARD_SPACING = TOTAL_DEPTH / (BASE_VISIBLE_CARDS / 2)
  const TUNNEL_LOOP_DEPTH = CARD_SPACING * (TOTAL_CARDS / 2)

  const lerp = (a, b, t) => a + (b - a) * t
  const clamp01 = (value) => Math.min(1, Math.max(0, value))
  const wrap01 = (value) => ((value % 1) + 1) % 1

  const createSeededRandom = (seed) => {
    let state = seed >>> 0
    return () => {
      state = (state + 0x6d2b79f5) >>> 0
      let t = Math.imul(state ^ (state >>> 15), 1 | state)
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t)
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
  }

  const getShuffledImages = (images, seed) => {
    const random = createSeededRandom(seed)
    const shuffled = [...images]
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const nextIndex = Math.floor(random() * (index + 1))
      const current = shuffled[index]
      shuffled[index] = shuffled[nextIndex]
      shuffled[nextIndex] = current
    }
    return shuffled
  }

  const TUNNEL_CARD_IMAGES = getShuffledImages(IMAGES, 1404).slice(0, TOTAL_CARDS)

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vViewDirection;

    void main() {
      vUv = uv;
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vViewDirection = normalize(cameraPosition - worldPosition.xyz);
      gl_Position = projectionMatrix * viewMatrix * worldPosition;
    }
  `

  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uOpacity;
    uniform float uGlossEnergy;
    uniform float uNarrowGloss;
    uniform float uGlossShift;
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    varying vec3 vViewDirection;

    void main() {
      vec2 sampleUv = clamp(vUv, vec2(0.001), vec2(0.999));
      vec4 color = texture2D(uTexture, sampleUv);
      float glossEnergy = clamp(uGlossEnergy, 0.0, 1.0);
      float narrowEnergy = clamp(uNarrowGloss, 0.0, 1.0);
      vec3 normal = normalize(vWorldNormal);
      vec3 viewDirection = normalize(vViewDirection);
      float facing = clamp(abs(dot(normal, viewDirection)), 0.0, 1.0);
      float grazing = pow(1.0 - facing, 1.75);
      float laminate = pow(facing, 0.45);
      float baseSheenAxis = sampleUv.x + sampleUv.y * 0.18;
      float baseCenter = 0.5 + (uGlossShift - 0.5) * 0.26;
      float baseGloss = exp(-pow((baseSheenAxis - baseCenter) / 0.28, 2.0)) * glossEnergy * (0.08 + laminate * 0.08 + grazing * 0.04);
      float narrowSheenAxis = sampleUv.x + sampleUv.y * 0.34;
      float narrowSheenCenter = 0.42 + (uGlossShift - 0.5) * 0.3;
      float narrowGloss = exp(-pow((narrowSheenAxis - narrowSheenCenter) / 0.13, 2.0)) * narrowEnergy * (0.04 + grazing * 0.1);
      float topReflection = smoothstep(0.64, 1.0, sampleUv.y) * smoothstep(0.05, 0.55, sampleUv.x) * glossEnergy * grazing * 0.05;
      float centerMask = smoothstep(0.0, 0.18, sampleUv.x) * (1.0 - smoothstep(0.82, 1.0, sampleUv.x));
      float edgeShadow = (1.0 - centerMask) * glossEnergy * 0.04;
      float edgeVignette = smoothstep(0.0, 0.1, min(min(sampleUv.x, 1.0 - sampleUv.x), min(sampleUv.y, 1.0 - sampleUv.y)));

      color.rgb *= 1.0 + glossEnergy * 0.03;
      color.rgb *= 1.0 - edgeShadow;
      color.rgb *= mix(0.96, 1.0, edgeVignette);
      color.rgb += vec3(1.0) * (baseGloss + narrowGloss + topReflection);
      color.a *= uOpacity;

      if (color.a <= 0.002) {
        discard;
      }

      gl_FragColor = color;

      #include <colorspace_fragment>
    }
  `

  const createCardsData = () => {
    const random = createSeededRandom(404)
    const cards = []

    for (let index = 0; index < TOTAL_CARDS; index += 1) {
      const side = index % 2 === 0 ? 'left' : 'right'
      const pairIndex = Math.floor(index / 2)
      const zOffset = pairIndex * CARD_SPACING + (random() - 0.5) * CARD_SPACING * 0.4
      const cardHeight = lerp(2.2, 4.0, random())
      const yOffset = (random() - 0.5) * 1.5

      cards.push({
        path: TUNNEL_CARD_IMAGES[index % TUNNEL_CARD_IMAGES.length],
        side,
        zOffset,
        yOffset,
        scaleX: cardHeight * DEFAULT_IMAGE_ASPECT,
        scaleY: cardHeight,
      })
    }

    return cards
  }

  const makeCanvas = (width, height) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  }

  const makePlaceholderTexture = () => {
    const canvas = makeCanvas(2, 2)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#dcdcdc'
    ctx.fillRect(0, 0, 2, 2)
    return new THREE.CanvasTexture(canvas)
  }

  const canvas = document.getElementById('gallery')
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0xf2f2f2, 1)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    CAMERA_FOV,
    window.innerWidth / window.innerHeight,
    0.1,
    200,
  )
  camera.position.set(0, 0, CAMERA_Z)

  const placeholderTexture = makePlaceholderTexture()
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy()
  const textureLoader = new THREE.TextureLoader()
  const cardGeometry = new THREE.PlaneGeometry(1, 1)

  const cards = createCardsData().map((data, index) => {
    const uniforms = {
      uTexture: { value: placeholderTexture },
      uOpacity: { value: 1 },
      uGlossEnergy: { value: PAPER_GLOSS_IDLE },
      uNarrowGloss: { value: PAPER_GLOSS_NARROW },
      uGlossShift: { value: 0.5 },
    }
    const material = new THREE.ShaderMaterial({
      transparent: true,
      toneMapped: false,
      depthWrite: true,
      depthTest: true,
      side: THREE.DoubleSide,
      uniforms,
      vertexShader,
      fragmentShader,
    })
    const mesh = new THREE.Mesh(cardGeometry, material)
    mesh.visible = false
    scene.add(mesh)

    textureLoader.load(data.path, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.anisotropy = maxAnisotropy
      uniforms.uTexture.value = texture
    })

    return { data, index, mesh, material, uniforms }
  })

  const overlay = new THREE.Group()
  overlay.position.set(0, 0.1, SCENE_TEXT_Z)
  scene.add(overlay)

  const addText = (parent, text, properties, position, renderOrder) => {
    const mesh = new Text()
    Object.assign(mesh, {
      text,
      anchorX: 'center',
      anchorY: 'middle',
      sdfGlyphSize: 64,
      ...properties,
    })
    mesh.position.set(...position)
    mesh.renderOrder = renderOrder
    parent.add(mesh)
    mesh.sync()
    return mesh
  }

  addText(overlay, '404', {
    color: '#070912',
    fontSize: 2.52,
    fontWeight: 500,
    letterSpacing: -0.02,
  }, [0, 2.05, 0], 20)

  addText(overlay, 'This page no longer exists\nor has been moved', {
    color: '#070912',
    fillOpacity: 0.6,
    fontSize: 0.48,
    lineHeight: 1.25,
    maxWidth: 7.2,
    textAlign: 'center',
  }, [0, 0.1, 0], 20)

  const radius = 0.625
  const epsilon = 0.00001
  const buttonShape = new THREE.Shape()
  buttonShape.absarc(epsilon, epsilon, epsilon, -Math.PI / 2, -Math.PI, true)
  buttonShape.absarc(epsilon, 1.25 - (radius - epsilon) * 2, epsilon, Math.PI, Math.PI / 2, true)
  buttonShape.absarc(4.1 - (radius - epsilon) * 2, 1.25 - (radius - epsilon) * 2, epsilon, Math.PI / 2, 0, true)
  buttonShape.absarc(4.1 - (radius - epsilon) * 2, epsilon, epsilon, 0, -Math.PI / 2, true)
  const buttonGeometry = new THREE.ExtrudeGeometry(buttonShape, {
    depth: 0.12 - radius * 2,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 1,
    bevelSize: radius - epsilon,
    bevelThickness: radius,
    curveSegments: 24,
  })
  buttonGeometry.center()
  const buttonGroup = new THREE.Group()
  buttonGroup.position.set(0, -1.8, 0)
  overlay.add(buttonGroup)
  const button = new THREE.Mesh(
    buttonGeometry,
    new THREE.MeshBasicMaterial({ color: '#16161f', toneMapped: false }),
  )
  buttonGroup.add(button)
  addText(buttonGroup, 'GO HOME', {
    color: '#ffffff',
    fontSize: 0.38,
    fontWeight: 700,
    letterSpacing: 0.12,
  }, [0, 0, 0.08], 21)

  const raycaster = new THREE.Raycaster()
  const pointerNdc = new THREE.Vector2()
  let buttonHovered = false

  const state = {
    scrollOffset: 0,
    velocity: 0,
    speedMultiplier: 1,
    targetSpeedMultiplier: 1,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
  }

  const tmpVector = new THREE.Vector3()
  const tmpQuaternion = new THREE.Quaternion()
  const tmpEuler = new THREE.Euler()

  const handlePointerMove = (event) => {
    state.mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1
    state.mouse.targetY = -((event.clientY / window.innerHeight) * 2 - 1)

    pointerNdc.set(state.mouse.targetX, state.mouse.targetY)
    raycaster.setFromCamera(pointerNdc, camera)
    const hit = raycaster.intersectObject(button, false).length > 0
    if (hit !== buttonHovered) {
      buttonHovered = hit
      document.body.style.cursor = hit ? 'pointer' : ''
    }
  }

  const resetPointer = () => {
    state.mouse.targetX = 0
    state.mouse.targetY = 0
  }

  const handleWheel = (event) => {
    event.preventDefault()
    state.velocity += event.deltaY * SCROLL_SPEED
  }

  const handleClick = () => {
    if (buttonHovered) {
      window.location.href = HOME_URL
    }
  }

  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerleave', resetPointer)
  window.addEventListener('blur', resetPointer)
  window.addEventListener('wheel', handleWheel, { passive: false })
  window.addEventListener('resize', handleResize)
  canvas.addEventListener('click', handleClick)

  const tick = () => {
    state.velocity *= 0.92
    state.speedMultiplier +=
      (state.targetSpeedMultiplier - state.speedMultiplier) * 0.1
    state.scrollOffset +=
      (state.velocity * 0.02 + AUTO_FORWARD_SPEED) * state.speedMultiplier

    const mouse = state.mouse
    mouse.x = lerp(mouse.x, mouse.targetX, MOUSE_SMOOTHING)
    mouse.y = lerp(mouse.y, mouse.targetY, MOUSE_SMOOTHING)

    const lookX = Math.sign(mouse.x) * Math.pow(Math.abs(mouse.x), 1.5)
    const targetRotY = -lookX * (Math.PI * 0.4)
    const targetPosX = -lookX * (WALL_DISTANCE * 0.55)
    const targetPosZ = CAMERA_Z + Math.abs(lookX) * 1.5

    camera.position.lerp(tmpVector.set(targetPosX, 0, targetPosZ), 0.08)
    tmpQuaternion.setFromEuler(tmpEuler.set(0, targetRotY, 0))
    camera.quaternion.slerp(tmpQuaternion, 0.08)

    state.targetSpeedMultiplier = 1 - Math.pow(Math.abs(mouse.x), 1.5) * 0.98

    const camZ = camera.position.z
    for (const card of cards) {
      const data = card.data
      const currentZOffset =
        (((data.zOffset + state.scrollOffset) % TUNNEL_LOOP_DEPTH) +
          TUNNEL_LOOP_DEPTH) %
        TUNNEL_LOOP_DEPTH
      const z = FAR_Z + currentZOffset

      const fadeNear = clamp01(1 - (z - camZ) / 3)
      const fadeFar = clamp01((z - FAR_Z) / 15)
      const fadeCenterVoid = clamp01((z - CENTER_VOID_START_Z) / CENTER_VOID_FADE_DEPTH)
      const opacity = Math.min(fadeNear, fadeFar, fadeCenterVoid)
      const visible = z < camZ + 3 && z > FAR_Z && opacity > 0.01

      card.mesh.visible = visible

      if (visible) {
        card.mesh.position.set(
          data.side === 'left' ? -WALL_DISTANCE : WALL_DISTANCE,
          data.yOffset,
          z,
        )
        card.mesh.rotation.set(0, data.side === 'left' ? Math.PI / 2 : -Math.PI / 2, 0)
        card.mesh.scale.set(data.scaleX, data.scaleY, 1)

        const depthGloss = clamp01(1 - Math.abs(z - SCENE_TEXT_Z) / 34)
        const uniforms = card.uniforms
        uniforms.uOpacity.value = opacity
        uniforms.uGlossEnergy.value = PAPER_GLOSS_IDLE + depthGloss * 0.08
        uniforms.uNarrowGloss.value = PAPER_GLOSS_NARROW + depthGloss * 0.05
        uniforms.uGlossShift.value = wrap01(z * 0.015 + card.index * 0.17)
      }
    }

    renderer.render(scene, camera)
    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
})()

})().catch(error => console.error('Gallery failed to load:', error))
