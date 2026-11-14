import { useEffect, useRef, useState } from 'react'

const trioSlides = [
  { src: '/assets/tela-brinde.jpg', alt: 'Três conselheiros durante uma chamada on-line' },
  { src: '/assets/tela-trio-2.jpg', alt: 'Outro trio do conselho durante uma chamada on-line' },
  { src: '/assets/tela-trio-3.jpg', alt: 'Três integrantes em mais uma reunião on-line' },
]

const memories = [
  { src: '/assets/conselho-sala.jpg', alt: 'Conselho reunido em sala', className: 'memory--wide' },
  { src: '/assets/rede-junta.jpg', alt: 'Grande encontro da rede ao ar livre', className: 'memory--tall' },
  { src: '/assets/encontro-noite.jpg', alt: 'Amigos do conselho reunidos à noite' },
  { src: '/assets/selfie.jpg', alt: 'Quatro integrantes registrando uma selfie' },
  { src: '/assets/mascotes-utfpr.jpg', alt: 'Mascotes das empresas juniores em uma plenária', className: 'memory--wide' },
  { src: '/assets/historias.jpg', alt: 'Cartões escritos ao lado de uma bandeira', className: 'memory--tall' },
]

function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function update() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return progress
}

function useRevealOnScroll() {
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.13, rootMargin: '0px 0px -5% 0px' })

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])
}

function TrioCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const timer = window.setInterval(() => {
      setCurrent((index) => (index + 1) % trioSlides.length)
    }, 3200)
    return () => window.clearInterval(timer)
  }, [paused])

  return (
    <div
      className="photo photo--small tilt-right trio-carousel"
      aria-label="Fotos das chamadas de três pessoas"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="trio-carousel__viewport">
        {trioSlides.map((slide, index) => (
          <img
            key={slide.src}
            className={index === current ? 'is-active' : ''}
            src={slide.src}
            loading="lazy"
            alt={slide.alt}
          />
        ))}
      </div>
      <p className="trio-carousel__caption">Os trios mudavam. A conversa continuava.</p>
      <div className="trio-carousel__dots" aria-label="Escolher foto">
        {trioSlides.map((slide, index) => (
          <button
            key={slide.src}
            className={index === current ? 'is-active' : ''}
            type="button"
            aria-label={`Ver ${index + 1}ª foto`}
            aria-pressed={index === current}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  const progress = useScrollProgress()
  const [lightbox, setLightbox] = useState(null)
  const lightboxRef = useRef(null)
  const biscuitRef = useRef(null)

  useRevealOnScroll()

  useEffect(() => {
    const dialog = lightboxRef.current
    if (!dialog) return
    if (lightbox && !dialog.open) dialog.showModal()
    if (!lightbox && dialog.open) dialog.close()
  }, [lightbox])

  return (
    <>
      <div className="progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
      <a className="skip-link" href="#historia">Ir para a história</a>

      <header className="hero" id="topo">
        <img className="hero__photo" src="/assets/hero-conselho.jpg" alt="Grande encontro do Conselho NEJ Londrina" />
        <div className="hero__wash" aria-hidden="true" />
        <div className="hero__scribble scribble--one" aria-hidden="true" />
        <div className="hero__scribble scribble--two" aria-hidden="true" />
        <div className="hero__content">
          <p className="eyebrow"><span /> Conselho NEJ Londrina · 2026</p>
          <h1>E aí,<br /><em>Conselho?</em></h1>
          <p className="hero__lead">Bora dar uma olhada no nosso ano? Tem reunião, perrengue, mascote e muita história no meio.</p>
        </div>
        <a className="scroll-cue" href="#historia" aria-label="Começar a história">
          <span>bora lembrar</span>
          <i aria-hidden="true">↓</i>
        </a>
      </header>

      <main id="historia">
        <section className="opening paper section-pad">
          <div className="opening__mark reveal" aria-hidden="true">2026</div>
          <div className="opening__copy reveal">
            <p className="kicker">Pra começar</p>
            <h2>2026 começou sem roteiro pronto.<br />A gente foi <span>escrevendo junto.</span></h2>
            <p>No começo, tinha mais pergunta do que resposta. A gente foi entendendo o papel do Conselho na prática: ouvindo cada EJ, discordando, decidindo e ajustando a rota no caminho.</p>
            <p className="hand-note">Do nosso jeito.</p>
          </div>
        </section>

        <section className="chapter chapter--dark section-pad" aria-labelledby="cap1">
          <div className="chapter__number reveal">01</div>
          <div className="chapter__intro reveal">
            <p className="kicker">Lá do começo</p>
            <h2 id="cap1">Teve Conselho que coube em três quadradinhos.</h2>
            <p>Entre uma call e outra, a gente foi se conhecendo, trocando ideia e criando espaço para falar do que realmente importava para cada EJ.</p>
          </div>
          <div className="screen-story reveal">
            <figure className="photo photo--main tilt-left">
              <img src="/assets/tela-conselho.jpg" loading="lazy" alt="Reunião on-line com muitos integrantes do conselho" />
              <figcaption>Uma call puxava a outra. E, aos poucos, o Conselho ganhava rosto.</figcaption>
            </figure>
            <TrioCarousel />
          </div>
        </section>

        <section className="manifesto-band" aria-label="Momentos do conselho">
          <div className="marquee" aria-hidden="true">
            <span>CALL <i>+</i> REPASSE <b>✦</b> DECISÃO <i>+</i> RISADA <b>✦</b>&nbsp;</span>
            <span>CALL <i>+</i> REPASSE <b>✦</b> DECISÃO <i>+</i> RISADA <b>✦</b>&nbsp;</span>
          </div>
        </section>

        <section className="chapter chapter--cream section-pad" aria-labelledby="cap2">
          <div className="chapter__number reveal">02</div>
          <div className="chapter__intro reveal">
            <p className="kicker">Fora da tela</p>
            <h2 id="cap2">Depois, a gente saiu dos <span>quadradinhos.</span></h2>
            <p>Vieram os encontros presenciais, as bandeiras, os mascotes e aquele caos organizado que só quem estava lá entende. O Conselho deixou de ser só um horário na agenda.</p>
          </div>
          <div className="photo-pair reveal">
            <figure className="photo photo--portrait tilt-left">
              <img src="/assets/grupo-vermelho.jpg" loading="lazy" alt="Grande grupo reunido com camisetas vermelhas" />
            </figure>
            <figure className="photo photo--landscape tilt-right">
              <img src="/assets/bandeiras.jpg" loading="lazy" alt="Integrantes reunidos com bandeiras de suas empresas juniores" />
            </figure>
            <p className="photo-pair__note">Cada EJ com seu jeito.<br /><strong>Todo mundo no mesmo Conselho.</strong></p>
          </div>
        </section>

        <section className="lenses section-pad" aria-labelledby="lentes-title">
          <div className="lenses__heading reveal">
            <p className="kicker">As três lentes, na prática</p>
            <h2 id="lentes-title">Afinal, o que a gente fazia ali?</h2>
          </div>
          <div className="lenses__grid">
            <article className="lens reveal"><span>01</span><h3>Acionista</h3><p>Pensar no NEJ como um todo antes de olhar só para a realidade da própria EJ.</p></article>
            <article className="lens reveal"><span>02</span><h3>Articulador</h3><p>Levar a conversa do Conselho para a EJ — e trazer a voz da EJ de volta para a mesa.</p></article>
            <article className="lens reveal"><span>03</span><h3>Cliente</h3><p>Dizer o que funcionava, o que não funcionava e o que precisava ser melhor para a rede.</p></article>
          </div>
        </section>

        <section className="chapter chapter--dark section-pad" aria-labelledby="cap3">
          <div className="chapter__number reveal">03</div>
          <div className="chapter__intro reveal">
            <p className="kicker">Nosso jeito de fazer</p>
            <h2 id="cap3">No meio do trabalho, criamos as nossas <span>próprias tradições.</span></h2>
            <p>Momento biscoito, mascotes ocupando a mesa, apresentações que viravam história e muita conversa depois da pauta. Era trabalho — mas tinha a nossa cara.</p>
          </div>
          <div className="collage reveal">
            <figure className="collage__a"><img src="/assets/encontro-noite.jpg" loading="lazy" alt="Integrantes do conselho reunidos depois de um encontro" /></figure>
            <figure className="collage__b"><img src="/assets/mascotes-mesa.jpg" loading="lazy" alt="Mascotes das empresas juniores reunidos sobre uma mesa" /></figure>
            <figure className="collage__c"><img src="/assets/ritual-palco.jpg" loading="lazy" alt="Momento descontraído de apresentação" /></figure>
            <div className="collage__sticker" aria-hidden="true">QUEM<br />ESTAVA LÁ<br /><b>ENTENDE</b></div>
          </div>
        </section>

        <section className="chapter chapter--red section-pad" aria-labelledby="cap4">
          <div className="chapter__number reveal">04</div>
          <div className="chapter__intro reveal">
            <p className="kicker">Nem tudo saiu como planejado</p>
            <h2 id="cap4">Teve rota refeita.<br />E muita coisa <span>aprendida.</span></h2>
            <p>Entre decisões, ajustes e conversas sinceras, o Conselho foi encontrando seu jeito de fazer melhor. Nem sempre era sobre ter a resposta certa — às vezes era sobre fazer a pergunta que precisava ser feita.</p>
          </div>
          <figure className="full-photo reveal">
            <img src="/assets/abraco.jpg" loading="lazy" alt="Integrantes do conselho reunidos em um abraço coletivo" />
            <figcaption>No fim, Conselho também é isso:<br /><strong>ter com quem dividir o peso e a conquista.</strong></figcaption>
          </figure>
        </section>

        <section className="rules paper section-pad" aria-labelledby="regras-title">
          <div className="rules__title reveal">
            <p className="kicker">As regras não negociáveis</p>
            <h2 id="regras-title">As frases que lembravam o que importava.</h2>
          </div>
          <div className="rules__list">
            <article className="rule reveal"><span>RNN 01</span><h3>Nosso forte é a união.</h3></article>
            <article className="rule reveal"><span>RNN 02</span><h3>Compromisso e constância.</h3></article>
            <article className="rule reveal"><span>RNN 03</span><h3>Juntos pela excelência.</h3></article>
            <article className="rule rule--wide reveal"><span>RNN 04</span><h3>Metas são um conjunto de histórias a serem contadas.</h3></article>
          </div>
        </section>

        <section className="gallery-section section-pad" aria-labelledby="galeria-title">
          <div className="gallery-section__heading reveal">
            <p className="kicker">Sem pauta e sem ata</p>
            <h2 id="galeria-title">O resto do ano ficou nas fotos.</h2>
            <p>Toque para ampliar e lembrar de mais um pedaço.</p>
          </div>
          <div className="memory-grid">
            {memories.map((memory) => (
              <button
                key={memory.src}
                className={`memory reveal ${memory.className ?? ''}`}
                type="button"
                aria-label={`Ampliar: ${memory.alt}`}
                onClick={() => setLightbox(memory)}
              >
                <img src={memory.src} loading="lazy" alt={memory.alt} />
              </button>
            ))}
          </div>
        </section>

        <section className="all-ejs section-pad">
          <div className="all-ejs__copy reveal">
            <p className="kicker">Olha quanta gente tinha nessa história</p>
            <h2>Cada EJ trouxe um pedaço.<br /><span>O ano ficou nosso.</span></h2>
          </div>
          <figure className="all-ejs__card reveal">
            <img src="/assets/todas-ej-juntas.png" loading="lazy" alt="Logos das empresas juniores reunidas no NEJ Londrina" />
          </figure>
        </section>

        <section className="finale" aria-labelledby="final-title">
          <img className="finale__photo" src="/assets/hero-conselho.jpg" loading="lazy" alt="Conselho NEJ Londrina reunido ao final do ano" />
          <div className="finale__overlay" aria-hidden="true" />
          <div className="finale__content reveal">
            <p className="kicker">E foi isso</p>
            <h2 id="final-title">Teve trabalho, encontro, perrengue e <span>muita gente.</span></h2>
            <p>Talvez nenhuma foto conte o ano inteiro. Mas, olhando tudo de novo, dá para lembrar: a gente fez bastante coisa acontecer por aqui.</p>
            <button className="biscuit-button" type="button" onClick={() => biscuitRef.current?.showModal()}>
              <span>abrir um</span> momento biscoito <i aria-hidden="true">↗</i>
            </button>
          </div>
          <div className="finale__signature reveal">
            <p>Valeu por ter feito parte.</p>
            <img src="/assets/logo-nejlon.png" alt="NEJ Londrina, Núcleo das Empresas Juniores de Londrina" />
          </div>
        </section>
      </main>

      <footer>
        <p>Conselho NEJ Londrina · 2026</p>
        <a href="#topo">voltar ao começo ↑</a>
      </footer>

      <dialog
        ref={lightboxRef}
        className="lightbox"
        aria-label="Foto ampliada"
        onClose={() => setLightbox(null)}
        onClick={(event) => { if (event.target === event.currentTarget) setLightbox(null) }}
      >
        <button className="lightbox__close" type="button" aria-label="Fechar foto" onClick={() => setLightbox(null)}>×</button>
        {lightbox && <img src={lightbox.src} alt={lightbox.alt} />}
      </dialog>

      <dialog
        ref={biscuitRef}
        className="biscuit"
        aria-labelledby="biscuit-title"
        onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close() }}
      >
        <button className="biscuit__close" type="button" aria-label="Fechar mensagem" onClick={() => biscuitRef.current?.close()}>×</button>
        <p className="biscuit__eyebrow">momento biscoito</p>
        <h2 id="biscuit-title">Você fez parte disso.</h2>
        <p>Valeu por cada call, cada contribuição, cada ida, cada volta e cada vez que você colocou a sua EJ nessa conversa.</p>
        <strong>2026 ficou mais nosso porque você estava lá.</strong>
        <span className="biscuit__cookie" aria-hidden="true">✦</span>
      </dialog>
    </>
  )
}

export default App
