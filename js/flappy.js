// THIS DENTRO DE ALGUMA COISA AQUELE ATRIBUTO PASSA A SER VISÍVEL FORA DA FUNÇÃO 

//QUANDO ESTÂNCIA E CHAMA O OBJETO VOCÊ CONSEGUE CHAMAR A FUNÇÃO QUE TÁ LÁ DENTRO
function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// const b = new barreira(true)
// b.setAltura(200)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function parDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')
    this.superior = new barreira(true)
    this.inferior = new barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        // Math.random() vai de 0 até 1
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]) //convertendo para inteiro.

    this.setX = x => this.elemento.style.left = `${x}px` //o left fica dentro de style.
    this.getLargura = () => this.elemento.clientWidth
    this.sortearAbertura()
    this.setX(x)
}

// const b =  new parDeBarreiras(700,200,800)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new parDeBarreiras(altura, abertura, largura),
        new parDeBarreiras(altura, abertura, largura + espaco),
        new parDeBarreiras(altura, abertura, largura + espaco * 2),
        new parDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            //quando o elemento sair da tela.

            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }
            const meio = largura / 2
            const cruzouOmeio = par.getX() + deslocamento >= meio && par.getX() < meio
            if (cruzouOmeio) notificarPonto()
        })
    }
}



function Passaro(alturaJogo) {
    let voando = false
    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    // quando clicar em qualquer tecla
    window.onkeyup = e => voando = false
    // quando soltar 

    this.animar = () => {
        const novoY = this.getY() + (voando ? 5 : -3)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight
        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)
}






function Progresso() {
    this.elemento = novoElemento('span', 'progresso')
    this.atualizarPonto = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizarPonto(0)
}

// const barreiras = new Barreiras(700, 1100, 200, 400)
// const passaro = new Passaro(700)
// const areaDojog = document.querySelector('[wm-flappy]')


// areaDojog.appendChild(passaro.elemento)
// areaDojog.appendChild(new Progresso().elemento)
// barreiras.pares.forEach(par => areaDojog.appendChild(par.elemento));
// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()

// }, 20)

function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect() // pega o retângulo associado ao elemento a
    const b = elementoB.getBoundingClientRect()

    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(pardebarreiras => {
        if (!colidiu) {
            const superior = pardebarreiras.superior.elemento
            const inferior = pardebarreiras.inferior.elemento
            colidiu = estaoSobrepostos(passaro.elemento, superior) || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu
}


function flappyBird() {

    let pontos = 0
    const areaDojog = document.querySelector('[wm-flappy]')
    const altura = areaDojog.clientHeight
    const largura = areaDojog.clientWidth
    const progresso = new Progresso()

    const barreiras = new Barreiras(altura, largura, 200, 400,
        () => progresso.atualizarPonto(++pontos))
    const passaro = new Passaro(altura)

    areaDojog.appendChild(progresso.elemento)
    areaDojog.appendChild(passaro.elemento)
    barreiras.pares.forEach(par => areaDojog.appendChild(par.elemento))



    this.start = () => {

        //  loop do jogo
        const temporizador = setInterval(() => {
            barreiras.animar()
            passaro.animar()

            if(colidiu(passaro,barreiras)){
                    clearInterval(temporizador) //para parar o jogo
            }

        }, 20)
    }

}



new flappyBird().start()
