'use strict';

let cores = ['blue', 'red', 'yellow', 'green', 'black']

let infoGraficoTemplate = {
    dados: undefined,
    cor: undefined,
    titulo: undefined,
    legendaEixoX: undefined,
    legendaEixoY: undefined,
    legenda: undefined
}

class Grafico {
    constructor (altura=500, largura=500) {
        this.altura = altura
        this.largura = largura
        this.margemVertical = 50
        this.margemHorizontal = 90
        this.margemEsquerda = this.margemHorizontal + 30

        this.info = Object.assign({}, infoGraficoTemplate)

        this.svg = this.criaSVG()
        
        this.dados = undefined
        this.maximos = undefined

        this.eixoX = undefined
        this.eixoY = undefined        
    }

    adicionaLabels(titulo, labelX, labelY) {
        this.info.titulo = titulo
        this.info.legendaEixoX = this.svg.append('text')
            .attr('transform', `translate(${this.largura/2} ,${this.altura-10})`)
            .text(labelX)
        this.info.legendaEixoY = this.svg.select('.eixoY').append('text').text(labelY)       
    }

    criaMargens() {
        this.eixoX = d3.axisBottom().scale(this.scalaX)
        this.eixoY = d3.axisLeft().scale(this.scalaY)
        let gridX = d3.axisBottom().scale(this.scalaX).ticks()
        let gridY = d3.axisLeft().scale(this.scalaY).ticks()

        this.svg.append("g")
            .attr("transform", `translate(0, ${this.altura - this.margemVertical})`)
            .attr("class", "grid")
            .call(gridX.tickSize(-(this.altura - this.margemVertical*2)).tickFormat(''));
        this.svg.append("g")
            .attr("transform", `translate(${this.margemHorizontal}, 0)`)
            .attr("class", "grid")
            .call(gridY.tickSize(-(this.largura - (this.margemEsquerda + this.margemHorizontal))).tickFormat('')); /* -(this.largura - (this.margemHorizontal*2) - 30) */

        this.svg.append("g")
            .attr('class', 'eixoX')
            .attr("transform", `translate(0, ${this.altura - this.margemVertical})`)
            .call(this.eixoX);
        this.svg.append("g")
            .attr('class', 'eixoY')
            .attr("transform", `translate(${this.margemHorizontal}, 0)`)
            .call(this.eixoY);
    }

    criaSVG() {
        let div = d3.select('body').append('div')
        let svg = div.append('svg')
        svg.attr('height', this.altura)
            .attr('width', this.largura)
            .attr('id', 'svg')
            .style('style', 'color: black');

        return svg
    }

    valoresMaximos() {
        let xMaximo = this.dados[0][0].x
        let yMaximo = this.dados[0][0].y
        for (let dados of this.dados) {        
            for(let ponto of dados) {
                if (ponto.x > xMaximo) {
                    xMaximo = ponto.x
                }
                if (ponto.y > yMaximo) {
                    yMaximo = ponto.y
                }            
            }
        }
        return {xMax: xMaximo, yMax: yMaximo}
    }

    adicionaBrush() {
        this.brush = this.svg.append('g')
            .attr('class', 'brush')
            .call(d3.brush().on('start brush', this.brushed.bind(this)))
    }

    adicionaZoom() {
        this.zoomX = this.svg.append('rect')
            .attr('width', this.margemHorizontal)
            .attr('height', this.altura)
            .attr('fill', 'transparent')
            .attr('class', 'zoom')
            .call(d3.zoom().on('zoom', this.zoomedY.bind(this)))

        this.zoomY = this.svg.append('rect')
            .attr('y', this.altura - this.margemVertical)
            .attr('width', this.largura)
            .attr('height', this.margemVertical)
            .attr('fill', 'transparent')
            .attr('class', 'zoom')
            .call(d3.zoom().on('zoom', this.zoomedX.bind(this)))
    }
    
}

class Histograma extends Grafico {
    constructor() {
        super(700, 1000)
        this.dados = []
        this.group = []
        this.dominio = []
    }

    criaEscala(i) {
        this.maximos = this.valoresMaximos()

        this.dominio = this.dados[0].map((el) => el.x)
        this.scalaX = d3.scaleBand()
            .domain(/* [this.dominio[0], this.dominio[this.dominio.legth]] */this.dominio)
            .range([this.margemHorizontal, this.largura - (this.margemEsquerda)])
            .padding(0.4)
        this.scalaY = d3.scaleLinear()
            .domain([this.maximos.yMax + 50, 0])
            .range([this.margemVertical, this.altura - this.margemVertical])
    }

    preenche() {
        for(let dados of this.dados) {
            this.group[0].selectAll('rect').data(dados).enter().append('rect')
                .attr("x", (d) => this.scalaX(d.x))
                .attr("y", (d) => this.scalaY(d.y))
                .attr('height', (d) => this.altura - this.margemVertical - this.scalaY(d.y))
                .attr('width', (d) => this.scalaX.bandwidth())
                .attr('fill', cores[0])
                .attr('data-group', `${this.dados.length-1}`);
        }
    }

    atribuiDados(dados) {
        this.dados.push(dados)
        this.criaEscala(this.dados.length)
        super.criaMargens()
        super.adicionaBrush()
        this.group.push(d3.select('#svg').append('g'))
        this.preenche()

    }

    brushed() {
        let sel = d3.event.selection

        this.group[0].selectAll('rect')
            .attr('fill', (d, a, b) => {
                if (this.scalaX(d.x) >= sel[0][0] && this.scalaX(d.x) <= sel[1][0] && this.scalaY(d.y) >= sel[0][1] && this.scalaY(d.y) <= sel[1][1] && 
                        this.scalaX(d.x)+this.scalaX.bandwidth() >= sel[0][0] && this.scalaX(d.x)+this.scalaX.bandwidth() <= sel[1][0] 
                        ||
                    this.scalaX(d.x) >= sel[0][0] && this.scalaX(d.x) <= sel[1][0] && this.scalaY(d.y) <= sel[0][1] && this.scalaY(d.y) <= sel[1][1]) {
                    return 'black'
                } else {
                    return cores[b[a].attributes['data-group'].value]
                }
            })
    }
}

/* let vetorBarras = [
    {x:1, y:5},
    {x:2, y:3},
    {x:3, y:7},
    {x:4, y:8},
    {x:5, y:25},
    {x:6, y:17},
    {x:7, y:10},
    {x:8, y:9},
    {x:9, y:8},
]
let hist = new Histograma()
hist.atribuiDados(vetorBarras) */

class ScatterPlot extends Grafico {
    constructor() {
        super(700, 1000)
        this.dados = []
        this.group = []
    }

    criaEscala() {
        this.maximos = this.valoresMaximos()

        this.scalaX = d3.scaleLinear()
            .domain([0, this.maximos.xMax + 50])
            .range([this.margemHorizontal, this.largura - (this.margemEsquerda)])
        this.scalaY = d3.scaleLinear()
            .domain([this.maximos.yMax + 50, 0])
            .range([this.margemVertical, this.altura - this.margemHorizontalVertical])
    }

    atribuiDados(dados) {
        this.dados.push(dados)
        this.criaEscala()
        if (this.dados.length == 1) {
            super.criaMargens()
            super.adicionaBrush()
            super.adicionaZoom()
        }
        this.group.push(d3.select('#svg').append('g'))
        this.preenche()
    }

    preenche() {
        let i = 0
        for(let dados of this.dados) {
            for(let ponto of dados) {
                this.group[i].selectAll('circle').data(dados).enter().append('circle')
                    .attr('cx', (d) => {return this.scalaX(d.x)})
                    .attr('cy', (d) => {return this.scalaY(d.y)})
                    .attr('r', 2.5)
                    .attr('class', 'points')
                    .attr('stroke-width', 0)
                    .attr('fill', cores[i])
                    .attr('data-group', `${this.dados.length-1}`);
            }
            i++
        }
    }

    brushed() {
        let sel = d3.event.selection

        this.svg.selectAll('circle')
            .attr('fill', (d, a, b) => {
                if (this.scalaX(d.x) >= sel[0][0] && this.scalaX(d.x) <= sel[1][0] &&
                    this.scalaY(d.y) >= sel[0][1] && this.scalaY(d.y) <= sel[1][1]) {
                    return 'black'
                } else {
                    return cores[b[a].attributes['data-group'].value]
                }
            })
    }

    zoomedX() {
        let novaScalaX = d3.event.transform.rescaleX(this.scalaX)
        this.eixoX.scale(novaScalaX)
        this.svg.select('.eixoX').call(this.eixoX)
        this.svg.selectAll('circle')
            .attr('cx', (d) => {return novaScalaX(d.x)})
    }

    zoomedY() {
        let novaScalaY = d3.event.transform.rescaleY(this.scalaY)
        this.eixoY.scale(novaScalaY)
        this.svg.select('.eixoY').call(this.eixoY)
        this.svg.selectAll('circle')
            .attr('cy', (d) => {return novaScalaY(d.y)})
    }
}


let vetorPontos = [
    {x: 50, y:50},
    {x: 100, y:100},
    {x: 15, y:200},
    {x: 80, y:400},
    {x: 70, y:350},
    {x: 35, y:250},
    {x: 40, y:150}
]
let vetorPontos2 = [
    {x: 60, y:70},
    {x: 110, y:120},
    {x: 25, y:220},
    {x: 90, y:420},
    {x: 80, y:370},
    {x: 45, y:270},
    {x: 50, y:170}
]

/* let scatter = new ScatterPlot()
scatter.atribuiDados(vetorPontos)
scatter.atribuiDados(vetorPontos2) */

class Serie extends Grafico {
    constructor() {
        super(700, 1000)
        this.dados = []
        this.group = []
    }

    criaEscala() {
        this.maximos = this.valoresMaximos()

        this.scalaX = d3.scaleLinear()
            .domain([0, this.maximos.xMax + 50])
            .range([this.margemHorizontal, this.largura - (this.margemEsquerda)])
        this.scalaY = d3.scaleLinear()
            .domain([this.maximos.yMax + 50, 0])
            .range([this.margemVertical, this.altura - this.margemVertical])
    }

    atribuiDados(dados) {
        this.dados.push(dados)
        this.criaEscala()
        if (this.dados.length == 1) {
            super.criaMargens()
            super.adicionaZoom()
        }
        this.group.push(d3.select('#svg').append('g'))
        this.preenche()
    }

    preenche() {
        let i = 0
        for(let dados of this.dados) {
            this.group[i].selectAll('polyline').data([dados]).enter().append('polyline')
                .attr("points", (d) => {
                    let saida = ''
                    for(let ponto of d) {
                        saida += `${this.scalaX(ponto.x)} ${this.scalaY(ponto.y)}, `
                    }
                    return saida
                })
                .attr('stroke', cores[i])
                .attr('fill', 'transparent')
                .attr('data-group', `${this.dados.length-1}`);
            i++
        }
    }

    /* brushed() {
        let sel = d3.event.selection

        this.svg.selectAll('polyline')
            .attr('stroke', (d, a, b) => {
                if (this.scalaX(d.x) >= sel[0][0] && this.scalaX(d.x) <= sel[1][0] &&
                    this.scalaY(d.y) >= sel[0][1] && this.scalaY(d.y) <= sel[1][1]) {
                    return 'black'
                } else {
                    return cores[b[a].attributes['data-group'].value]
                }
            })
    } */

    zoomedX() {
        let t = d3.event.transform
        let novaScalaX = t.rescaleX(this.scalaX)
        this.eixoX.scale(novaScalaX)
        this.svg.select('.eixoX').call(this.eixoX)
        this.svg.selectAll('polyline')
            .attr('transform', `translate(${t.x}, 0)`)
    }

    zoomedY() {
        let t = d3.event.transform
        let novaScalaY = t.rescaleY(this.scalaY)
        this.eixoY.scale(novaScalaY)
        this.svg.select('.eixoY').call(this.eixoY)
        this.svg.selectAll('polyline')
            .attr('transform', `translate(0, ${t.y})`)
    }
}

let vetorSerie = [
    {x: 0, y:50},
    {x: 15, y:200},
    {x: 35, y:250},
    {x: 40, y:150},
    {x: 50, y:50},
    {x: 70, y:350},
    {x: 80, y:400},
    {x: 100, y:100}
]
let vetorSerie2 = [
    {x: 0, y:100},    
    {x: 25, y:220},
    {x: 45, y:270},
    {x: 50, y:170},
    {x: 60, y:70},
    {x: 80, y:370},
    {x: 90, y:420},
    {x: 110, y:120}
]

let serie = new Serie()
serie.atribuiDados(vetorSerie)
serie.atribuiDados(vetorSerie2)
serie.adicionaLabels('afdfadsfad', 'dfadsfadsfads', 'dsfasdfgadsfads')