// Progressive enhancement for the shipwords landing page. The page reads without it.
(() => {
  const html = document.documentElement;
  const isZh = html.lang.toLowerCase().startsWith('zh');
  const reduced = html.classList.contains('reduce') || matchMedia('(prefers-reduced-motion: reduce)').matches;
  const t = (en, zh) => (isZh ? zh : en);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Reveal on scroll. The inline head script hides only when JS is present.
  const reveals = $$('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    for (const el of reveals) el.classList.add('is-in');
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    for (const el of reveals) io.observe(el);
  }

  const flash = (btn, label, className = 'is-done') => {
    const span = btn.querySelector('span');
    const original = span ? span.textContent : '';
    btn.classList.add(className);
    if (span) span.textContent = label;
    setTimeout(() => {
      btn.classList.remove(className);
      if (span) span.textContent = original;
    }, 1600);
  };

  const copyText = (text, btn, doneLabel, failLabel, selectTarget) => {
    const fail = () => {
      if (selectTarget) {
        if (selectTarget.select) selectTarget.select();
        else {
          const range = document.createRange();
          range.selectNodeContents(selectTarget);
          const selection = getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
      flash(btn, failLabel, 'is-error');
    };
    if (!navigator.clipboard || !window.isSecureContext) {
      fail();
      return;
    }
    navigator.clipboard.writeText(text).then(() => flash(btn, doneLabel), fail);
  };

  // Studio: pick a site, type a keyword, watch the page assemble.
  const sites = {
    tiny: {
      key: 'tiny',
      kw: 'tiny desk ai',
      name: 'Tiny Desk AI',
      domain: 'tinydeskai.io',
      theme: 'ember',
      image: '/img/result/tiny-desk-ai.webp',
      credits: 120,
      price: '$9.90',
      headline: t('Turn one photo into a Tiny Desk performance', '一张照片，换一段 Tiny Desk 现场'),
      sub: t(
        'Upload a photo. The whole desk sings back, mouths on the beat.',
        '上传一张照片，整桌人替你开唱，口型跟着节拍。',
      ),
      cta: t('Try it free', '免费试一次'),
      alt: t('Example result for Tiny Desk AI', 'Tiny Desk AI 的示例结果'),
      status: t('Took off · iterating', '跑出来了 · 继续迭代'),
    },
    pet: {
      key: 'pet',
      kw: 'pet portrait ai',
      name: 'Pet Portrait AI',
      domain: 'petportrait.ai',
      theme: 'pine',
      image: '/img/result/pet-portrait.webp',
      credits: 100,
      price: '$7.90',
      headline: t('Your pet, painted like a studio portrait', '把你的宠物画成影棚肖像'),
      sub: t(
        'One photo in, a gallery-ready portrait out. Three styles to start.',
        '一张照片，换来一张能挂进画廊的肖像。先有三种风格。',
      ),
      cta: t('Make a portrait', '做一张肖像'),
      alt: t('Example result for Pet Portrait AI', 'Pet Portrait AI 的示例结果'),
      status: t('Launched today', '今天刚上线'),
    },
    ghibli: {
      key: 'ghibli',
      kw: 'ghibli photo',
      name: 'Ghibli Photo',
      domain: 'ghibliphoto.ai',
      theme: 'sea',
      image: '/img/result/ghibli-photo.webp',
      credits: 80,
      price: '$6.90',
      headline: t('Put your weekend inside a hand-painted film', '把周末放进一部手绘电影'),
      sub: t(
        'Landscapes, warm light, a little movie magic. No prompt writing.',
        '风景、暖光、一点电影魔法。不用写提示词。',
      ),
      cta: t('Paint a photo', '画一张照片'),
      alt: t('Example result for Ghibli Photo', 'Ghibli Photo 的示例结果'),
      status: t('Quiet · left alone', '没跑出来 · 放着不管'),
    },
    baby: {
      key: 'baby',
      kw: 'ai baby generator',
      name: 'AI Baby',
      domain: 'aibaby.ai',
      theme: 'clay',
      image: '/img/result/ai-baby.webp',
      credits: 100,
      price: '$8.90',
      headline: t('See the family resemblance, years early', '提前几年看见一家人的相似'),
      sub: t('Two photos, one gentle preview. Private by default.', '两张照片，一张温和的预览。默认私密。'),
      cta: t('Try a preview', '看一次预览'),
      alt: t('Example result for AI Baby', 'AI Baby 的示例结果'),
      status: t('Quiet · left alone', '没跑出来 · 放着不管'),
    },
  };

  const titleCase = (value) =>
    value
      .split(' ')
      .filter(Boolean)
      .map((word) => (word.toLowerCase() === 'ai' ? 'AI' : word.charAt(0).toUpperCase() + word.slice(1)))
      .join(' ');

  const siteForKeyword = (raw) => {
    const kw = raw.trim().replace(/\s+/g, ' ');
    const preset = Object.values(sites).find((site) => site.kw === kw.toLowerCase());
    if (preset) return preset;
    const slug = kw
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 32);
    const domain = slug ? `${slug}.com` : 'yourkeyword.com';
    const name = titleCase(kw).slice(0, 32) || 'Your site';
    const hash = [...kw].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const theme = ['ember', 'pine', 'sea', 'clay'][hash % 4];
    const image = [
      '/img/result/tiny-desk-ai.webp',
      '/img/result/pet-portrait.webp',
      '/img/result/ghibli-photo.webp',
      '/img/result/ai-baby.webp',
    ][hash % 4];
    return {
      key: '',
      kw,
      name,
      domain,
      theme,
      image,
      credits: 120,
      price: '$9.90',
      headline: t(`Make something people search for`, `为「${kw}」做一个能收钱的 AI 站`),
      sub: t(
        `A complete AI site for “${kw}”, with sign-in, credits and checkout from day one.`,
        '登录、积分、收款和生成任务从第一天就配好。',
      ),
      cta: t('Try it free', '免费试一次'),
      alt: t(`Example result for ${kw}`, `${kw} 的示例结果`),
      status: t('New keyword', '新关键词'),
    };
  };

  const studio = $('[data-studio]');
  if (studio) {
    const form = $('[data-build-form]', studio);
    const input = $('#keyword', studio);
    const buildBtn = $('[data-build]', studio);
    const buildLabel = buildBtn.querySelector('span');
    const status = $('[data-status]', studio);
    const preview = $('[data-preview]', studio);
    const checks = $$('[data-check]', studio);
    const railButtons = $$('.site-pick', studio);
    const presetButtons = $$('.preset', studio);
    let building = false;
    let buildTimers = [];
    let currentSite = sites.tiny;

    const setChecks = (done) => {
      for (const check of checks) check.classList.toggle('is-done', done);
    };

    const sync = (site) => {
      for (const button of railButtons) {
        button.setAttribute('aria-pressed', String(Boolean(site.key) && button.dataset.site === site.key));
      }
      for (const button of presetButtons) {
        button.setAttribute('aria-pressed', String(button.dataset.kw === site.kw));
      }
    };

    const paint = (site) => {
      currentSite = site;
      preview.dataset.theme = site.theme;
      for (const el of $$('[data-name]', studio)) el.textContent = site.name;
      for (const el of $$('[data-domain]', studio)) el.textContent = site.domain;
      $('[data-initial]', studio).textContent = site.name.charAt(0).toUpperCase();
      $('[data-headline]', studio).textContent = site.headline;
      $('[data-sub]', studio).textContent = site.sub;
      const cta = $('[data-cta]', studio);
      const ctaIcon = cta.querySelector('.ico');
      cta.textContent = `${site.cta} `;
      if (ctaIcon) cta.append(ctaIcon);
      const image = $('[data-image]', studio);
      image.src = site.image;
      image.alt = site.alt;
      $('[data-credits]', studio).textContent = String(site.credits);
      $('[data-price]', studio).textContent = site.price;
      sync(site);
    };

    const finish = (site) => {
      paint(site);
      building = false;
      studio.classList.remove('is-building');
      studio.classList.add('is-fresh');
      setTimeout(() => studio.classList.remove('is-fresh'), 550);
      setChecks(true);
      status.classList.remove('is-error');
      status.textContent = t(
        `Site ready: ${site.domain} · 5 checks passed.`,
        `站点已就绪：${site.domain} · 5 项检查通过。`,
      );
      buildBtn.disabled = false;
      buildBtn.removeAttribute('aria-busy');
      buildLabel.textContent = t('Build site', '生成站点');
    };

    const clearBuildTimers = () => {
      for (const timer of buildTimers) clearTimeout(timer);
      buildTimers = [];
    };

    const build = (site) => {
      if (building) return;
      building = true;
      clearBuildTimers();
      studio.classList.remove('is-fresh');
      studio.classList.add('is-building');
      setChecks(false);
      status.classList.remove('is-error');
      status.textContent = t(`Building ${site.domain}…`, `正在生成 ${site.domain}…`);
      buildBtn.disabled = true;
      buildBtn.setAttribute('aria-busy', 'true');
      buildLabel.textContent = t('Building…', '生成中…');
      if (reduced) {
        finish(site);
        return;
      }
      checks.forEach((check, index) => {
        buildTimers.push(setTimeout(() => check.classList.add('is-done'), 240 + index * 270));
      });
      const total = 240 + checks.length * 270;
      buildTimers.push(setTimeout(() => paint(site), total - 180));
      buildTimers.push(setTimeout(() => finish(site), total));
    };

    for (const button of railButtons) {
      button.addEventListener('click', () => {
        const site = sites[button.dataset.site];
        if (!site || building) return;
        clearBuildTimers();
        input.value = site.kw;
        paint(site);
        setChecks(true);
        status.classList.remove('is-error');
        status.textContent = t(
          `Viewing ${site.name}. Type a keyword to build another.`,
          `正在查看 ${site.name}。输入关键词可以再建一个。`,
        );
      });
    }

    for (const button of presetButtons) {
      button.addEventListener('click', () => {
        if (building) return;
        input.value = button.dataset.kw;
        build(siteForKeyword(button.dataset.kw));
      });
    }

    for (const button of $$('[data-jump-kw]')) {
      button.addEventListener('click', () => {
        if (building) return;
        input.value = button.dataset.jumpKw;
        studio.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
        build(siteForKeyword(button.dataset.jumpKw));
      });
    }

    input.addEventListener('input', () => {
      const value = input.value.trim().toLowerCase();
      for (const button of presetButtons) {
        button.setAttribute('aria-pressed', String(button.dataset.kw === value));
      }
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (building) return;
      if (!input.value.trim()) {
        status.classList.add('is-error');
        status.textContent = t('Type a keyword first.', '先输入一个关键词。');
        input.focus();
        return;
      }
      build(siteForKeyword(input.value));
    });

    paint(currentSite);
    setChecks(true);
  }

  // Fleet: one core update reaches every site.
  const coreButton = $('[data-core-update]');
  if (coreButton) {
    const coreLabel = coreButton.querySelector('span');
    const versions = $$('[data-version]');
    const coreVersion = $('[data-core-version]');
    const coreStatus = $('[data-core-status]');
    const defaultNote = coreStatus.textContent;
    let coreBusy = false;

    coreButton.addEventListener('click', () => {
      if (coreBusy) return;
      coreBusy = true;
      coreButton.disabled = true;
      coreLabel.textContent = t('Updating…', '更新中…');
      coreStatus.textContent = t('Updating four sites from one commit…', '一次提交，正在更新四个站…');
      versions.forEach((version, index) => {
        setTimeout(
          () => {
            version.textContent = 'v0.1.1';
            version.classList.add('is-updated');
          },
          reduced ? 0 : 160 + index * 180,
        );
      });
      setTimeout(
        () => {
          coreVersion.textContent = 'v0.1.1';
          coreVersion.classList.add('is-updated');
          coreStatus.textContent = t('Updated four sites from one commit.', '一次提交，四个站都更新完了。');
        },
        reduced ? 20 : 1000,
      );
      setTimeout(
        () => {
          for (const version of versions) {
            version.textContent = 'v0.1.0';
            version.classList.remove('is-updated');
          }
          coreVersion.textContent = 'v0.1.0';
          coreVersion.classList.remove('is-updated');
          coreLabel.textContent = t('Ship a core update', '发布核心更新');
          coreButton.disabled = false;
          coreStatus.textContent = defaultNote;
          coreBusy = false;
        },
        reduced ? 900 : 3800,
      );
    });
  }

  // Media: switch between the viral original and the shipwords version.
  const mediaStage = $('.media-stage');
  if (mediaStage) {
    const clips = $$('[data-clip]');
    const switches = $$('[data-switch-clip]');
    const badge = $('[data-media-badge]');
    const captionLeft = $('[data-caption-left]');
    const captionRight = $('[data-caption-right]');
    const soundButton = $('[data-media-sound]');
    const playButton = $('[data-media-play]');
    const playIcon = $('[data-play-icon]');
    const captions = {
      original: {
        badge: t(
          '288K likes on TikTok · not made with shipwords',
          'TikTok 28.8 万赞 · 不是用 shipwords 做的',
        ),
        left: t(
          '<b>The viral original</b> · a real TikTok, not made with shipwords',
          '<b>爆款原片</b> · 真实的 TikTok，不是用 shipwords 做的',
        ),
        right: t('A real post with 288K likes', '真实帖子，28.8 万赞'),
      },
      ours: {
        badge: t('Made on Tiny Desk AI · AI-generated dogs', '用 Tiny Desk AI 制作 · 狗狗为 AI 生成'),
        left: t(
          '<b>Made on Tiny Desk AI</b> · all five swapped for dogs in one run',
          '<b>Tiny Desk AI 成片</b> · 五个人一次全换成狗',
        ),
        right: t('The dogs are AI-generated', '狗狗照片为 AI 生成'),
      },
    };
    let active = 'original';
    let soundOn = false;

    const currentClip = () => clips.find((clip) => clip.dataset.clip === active);
    const load = (clip) => {
      if (!clip.src) clip.src = clip.dataset.src;
      return clip;
    };

    const updateSound = () => {
      soundButton.setAttribute('aria-pressed', String(soundOn));
      soundButton.setAttribute(
        'aria-label',
        soundOn ? t('Mute video', '静音') : t('Play with sound', '打开声音'),
      );
      soundButton.querySelector('.ico').className =
        `ico ${soundOn ? 'ico-speaker-high' : 'ico-speaker-slash'}`;
    };

    const updatePlay = () => {
      const clip = currentClip();
      const playing = clip && !clip.paused;
      playIcon.className = `ico ${playing ? 'ico-pause' : 'ico-play'}`;
      playButton.setAttribute(
        'aria-label',
        playing ? t('Pause video', '暂停视频') : t('Play video', '播放视频'),
      );
    };

    const muteAll = () => {
      for (const clip of clips) clip.muted = true;
      soundOn = false;
      updateSound();
    };

    const selectClip = (name, autoplay = true) => {
      const previous = currentClip();
      if (previous) previous.pause();
      active = name;
      for (const clip of clips) {
        const on = clip.dataset.clip === name;
        clip.hidden = !on;
        if (on) {
          load(clip);
          if (autoplay && !reduced) clip.play().catch(() => {});
        }
      }
      for (const button of switches) {
        button.setAttribute('aria-pressed', String(button.dataset.switchClip === name));
      }
      badge.textContent = captions[name].badge;
      captionLeft.innerHTML = captions[name].left;
      captionRight.textContent = captions[name].right;
      muteAll();
      updatePlay();
    };

    for (const button of switches) {
      button.addEventListener('click', () => {
        if (button.dataset.switchClip === active) return;
        selectClip(button.dataset.switchClip);
      });
    }

    soundButton.addEventListener('click', () => {
      const clip = currentClip();
      if (!clip) return;
      soundOn = !soundOn;
      clip.muted = !soundOn;
      if (soundOn) clip.play().catch(() => {});
      updateSound();
    });

    playButton.addEventListener('click', () => {
      const clip = currentClip();
      if (!clip) return;
      if (clip.paused) clip.play().catch(() => {});
      else clip.pause();
    });

    for (const clip of clips) {
      clip.addEventListener('play', updatePlay);
      clip.addEventListener('pause', updatePlay);
      clip.addEventListener('click', () => {
        if (clip.dataset.clip !== active) return;
        if (clip.paused) clip.play().catch(() => {});
        else clip.pause();
      });
    }

    selectClip('original', false);
    updatePlay();

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        ([entry]) => {
          const clip = currentClip();
          if (!clip) return;
          if (entry.isIntersecting) {
            load(clip);
            if (!reduced) clip.play().catch(() => {});
          } else {
            clip.pause();
          }
        },
        { threshold: 0.4 },
      ).observe(mediaStage);
    }
  }

  // Tabs inside the "inside" panel.
  const tabRoot = $('[data-tabs]');
  if (tabRoot) {
    const tabs = $$('[role="tab"]', tabRoot);
    const panes = $$('[role="tabpanel"]', tabRoot);
    const ink = $('[data-tab-ink]', tabRoot);
    let active = tabs.findIndex((tab) => tab.getAttribute('aria-selected') === 'true');
    if (active < 0) active = 0;

    const moveInk = () => {
      const tab = tabs[active];
      if (!tab) return;
      ink.style.width = `${tab.offsetWidth}px`;
      ink.style.transform = `translateX(${tab.offsetLeft - tabs[0].offsetLeft}px)`;
    };

    const select = (index, focus = false) => {
      active = index;
      tabs.forEach((tab, i) => {
        const on = i === index;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
      });
      panes.forEach((pane, i) => {
        pane.hidden = i !== index;
      });
      moveInk();
      if (focus) tabs[index].focus();
    };

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', (event) => {
        let next = null;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === null) return;
        event.preventDefault();
        select(next, true);
      });
    });

    select(active);
    const tabList = $('.demo-tabs', tabRoot);
    if (tabList) tabList.classList.add('is-ready');
    window.addEventListener('resize', moveInk);
    if (document.fonts?.ready) document.fonts.ready.then(moveInk);

    // Money
    const payButton = $('[data-pay]', tabRoot);
    const checkout = $('[data-checkout]', tabRoot);
    const success = $('[data-pay-success]', tabRoot);
    const methods = $$('input[name="pay-method"]', tabRoot);
    const payLabel = () => {
      const method = methods.find((input) => input.checked)?.value === 'paypal' ? 'PayPal' : 'Stripe';
      payButton.textContent = t(`Pay $9.90 with ${method}`, `使用 ${method} 支付 $9.90`);
    };
    for (const input of methods) input.addEventListener('change', payLabel);
    payLabel();

    if (payButton) {
      payButton.addEventListener('click', () => {
        if (payButton.disabled) return;
        const label = payButton.textContent;
        payButton.disabled = true;
        payButton.setAttribute('aria-busy', 'true');
        payButton.textContent = t('Processing…', '处理中…');
        setTimeout(
          () => {
            checkout.hidden = true;
            success.hidden = false;
            success.setAttribute('role', 'status');
            payButton.disabled = false;
            payButton.removeAttribute('aria-busy');
            payButton.textContent = label;
          },
          reduced ? 0 : 850,
        );
      });
    }
    const payReset = $('[data-pay-reset]', tabRoot);
    if (payReset) {
      payReset.addEventListener('click', () => {
        success.hidden = true;
        checkout.hidden = false;
        payButton.focus();
      });
    }

    // Jobs
    const repairButton = $('[data-repair]', tabRoot);
    const repairJob = $('[data-job="repair"]', tabRoot);
    const repairChip = $('[data-repair-chip]', tabRoot);
    const repairMeta = $('[data-repair-meta]', tabRoot);
    const repairBar = $('[data-repair-bar]', tabRoot);
    const jobStatus = $('[data-job-status]', tabRoot);
    let repairBusy = false;
    if (repairButton) {
      repairButton.addEventListener('click', () => {
        if (repairBusy) return;
        repairBusy = true;
        repairButton.disabled = true;
        repairJob.dataset.state = 'running';
        repairChip.className = 'chip run';
        repairChip.textContent = t('Repairing', '补换中');
        repairMeta.textContent = '#813 · shot 4 of 5';
        repairBar.style.width = '78%';
        jobStatus.textContent = t('Re-rendering the missed shot…', '正在补换漏掉的镜头…');
        setTimeout(
          () => {
            repairMeta.textContent = '#813 · shot 5 of 5';
            repairBar.style.width = '100%';
          },
          reduced ? 0 : 650,
        );
        setTimeout(
          () => {
            repairJob.dataset.state = 'done';
            repairChip.className = 'chip done';
            repairChip.textContent = t('Delivered', '已交付');
            repairMeta.textContent = '#813 · delivered';
            jobStatus.textContent = t(
              'Repair pass complete. Best version delivered.',
              '补换完成，交付了目前最好的版本。',
            );
            repairButton.disabled = false;
            repairButton.textContent = t('Repair again', '再补一次');
            repairBusy = false;
          },
          reduced ? 20 : 1450,
        );
      });
    }

    // SEO checks
    const seoButton = $('[data-seo-run]', tabRoot);
    const seoItems = $$('[data-seo-item]', tabRoot);
    const seoStatus = $('[data-seo-status]', tabRoot);
    let seoBusy = false;
    if (seoButton) {
      seoButton.addEventListener('click', () => {
        if (seoBusy) return;
        seoBusy = true;
        seoButton.disabled = true;
        seoStatus.textContent = t('Checking the live surface…', '正在检查线上页面…');
        for (const item of seoItems) {
          item.classList.remove('is-done');
          item.querySelector('small').textContent = t('waiting', '等待');
        }
        seoItems.forEach((item, index) => {
          setTimeout(
            () => {
              item.classList.add('is-done');
              item.querySelector('small').textContent = t('ready', '通过');
            },
            reduced ? 0 : 120 + index * 210,
          );
        });
        setTimeout(
          () => {
            seoStatus.textContent = t(
              '6 checks passed. Submit the sitemap when the domain is live.',
              '6 项检查通过。域名上线后提交 sitemap。',
            );
            seoButton.disabled = false;
            seoButton.textContent = t('Run again', '再检查一次');
            seoBusy = false;
          },
          reduced ? 40 : 1500,
        );
      });
    }

    // Accounts
    const auth = $('[data-auth]', tabRoot);
    const account = $('[data-account]', tabRoot);
    const emailInput = $('#demo-email', tabRoot);
    const accountEmail = $('.account-head b', tabRoot);
    const accountMethod = $('.account-head div span', tabRoot);
    const signIn = (method) => {
      const email = emailInput.value.trim() || 'you@example.com';
      accountEmail.textContent = email;
      accountMethod.textContent = method;
      auth.hidden = true;
      account.hidden = false;
      account.setAttribute('role', 'status');
    };
    const google = $('[data-google]', tabRoot);
    const emailButton = $('[data-email]', tabRoot);
    const signout = $('[data-signout]', tabRoot);
    if (google) google.addEventListener('click', () => signIn(t('Signed in · Google', '已登录 · Google')));
    if (emailButton) {
      emailButton.addEventListener('click', () => signIn(t('Signed in · email code', '已登录 · 邮箱验证码')));
    }
    if (signout) {
      signout.addEventListener('click', () => {
        account.hidden = true;
        auth.hidden = false;
        emailInput.focus();
      });
    }
  }

  // Quick start: steps drive the terminal.
  const term = $('[data-term]');
  if (term) {
    const stepButtons = $$('[data-step]');
    const copyTerm = $('[data-copy-term]');
    let copyValue = '';

    const termSteps = {
      1: {
        copy: '',
        html: `<span class="tok-dim">${t('# Cloudflare Registrar, at cost', '# Cloudflare Registrar，按成本价')}</span>
ghibli-photo.com          <span class="tok-ok">$10.44/yr</span>`,
      },
      2: {
        copy: 'pnpm new-site ghibli-photo --domain ghibli-photo.com',
        html: `<span class="tok-cmd">pnpm new-site ghibli-photo --domain ghibli-photo.com</span>
<span class="tok-ok">✓</span> template copied
<span class="tok-ok">✓</span> database and domain wired`,
      },
      3: {
        copy: 'pnpm --filter "./sites/ghibli-photo" dev',
        html: `<span class="tok-cmd">pnpm --filter "./sites/ghibli-photo" dev</span>
<span class="tok-dim"># site.config.ts · src/models.server.ts · src/site/styles.css</span>
<span class="tok-ok">✓</span> localhost ready`,
      },
      4: {
        copy: 'git push origin main',
        html: `<span class="tok-cmd">git push origin main</span>
<span class="tok-dim"># Cloudflare build → checks → deploy</span>
<span class="tok-ok">✓</span> live on ghibli-photo.com`,
      },
    };

    const renderStep = (step) => {
      const data = termSteps[step] || termSteps[1];
      copyValue = data.copy;
      term.innerHTML = data.html;
      term.classList.remove('is-changing');
      void term.offsetWidth;
      term.classList.add('is-changing');
      copyTerm.hidden = !data.copy;
      for (const button of stepButtons) {
        button.setAttribute('aria-current', String(button.dataset.step === step));
      }
    };

    for (const button of stepButtons) {
      button.addEventListener('click', () => renderStep(button.dataset.step));
    }
    copyTerm.addEventListener('click', () => {
      if (!copyValue) return;
      copyText(copyValue, copyTerm, t('Copied', '已复制'), t('Select and copy', '请手动复制'), term);
    });
    renderStep('1');

    const promptInput = $('#agent-kw');
    const promptButton = $('[data-copy-prompt]');
    const promptHint = $('[data-prompt-hint]');
    const defaultHint = promptHint.textContent;

    const promptFor = (kw) =>
      isZh
        ? `阅读 https://shipwords.yololab.cc/llms.txt，帮我为「${kw}」做一个站。`
        : `Read https://shipwords.yololab.cc/llms.txt and build a site for "${kw}".`;

    promptButton.addEventListener('click', () => {
      const kw = promptInput.value.trim();
      if (!kw) {
        promptHint.classList.add('is-error');
        promptHint.textContent = t('Type a keyword first.', '先输入一个关键词。');
        promptInput.focus();
        return;
      }
      const text = promptFor(kw);
      const fail = () => {
        promptInput.select();
        promptHint.classList.add('is-error');
        promptHint.textContent = t(
          'Copy blocked: select the prompt and copy by hand.',
          '复制被拦截，请手动选中提示词复制。',
        );
      };
      if (!navigator.clipboard || !window.isSecureContext) {
        fail();
        return;
      }
      navigator.clipboard.writeText(text).then(() => {
        promptHint.classList.remove('is-error');
        promptHint.textContent = t(
          'Prompt copied. Paste it into Claude Code, Codex or Cursor.',
          '提示词已复制，粘贴到 Claude Code、Codex 或 Cursor。',
        );
        flash(promptButton, t('Copied', '已复制'));
      }, fail);
    });

    promptInput.addEventListener('input', () => {
      promptHint.classList.remove('is-error');
      promptHint.textContent = defaultHint;
    });
  }

  window.__shipwordsReady = true;
})();
