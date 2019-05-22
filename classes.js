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
        this.margemHorizontal = 50

        this.info = Object.assign({}, infoGraficoTemplate)

        this.svg = this.criaSVG()
        
        this.dados = undefined
        this.maximos = undefined
    }

    criaEscala() {
        this.maximos = this.valoresMaximos()

        this.scalaX = d3.scaleLinear()
            .domain([0, this.maximos.xMax + 50])
            .range([this.margemHorizontal, this.largura - (this.margemHorizontal + 30)])
        this.scalaY = d3.scaleLinear()
            .domain([this.maximos.yMax + 50, 0])
            .range([this.margemVertical, this.altura - this.margemHorizontal])
    }

    criaMargens() {
        this.criaEscala()

        let eixoX = d3.axisBottom().scale(this.scalaX)
        let eixoY = d3.axisLeft().scale(this.scalaY)
        let gridX = d3.axisBottom().scale(this.scalaX).ticks()
        let gridY = d3.axisLeft().scale(this.scalaY).ticks()

        this.svg.append("g")
            .attr("transform", `translate(0, ${this.altura - this.margemVertical})`)
            .attr("class", "grid")
            .call(gridX.tickSize(-(this.altura - (this.margemHorizontal*2))).tickFormat(''));
        this.svg.append("g")
            .attr("transform", `translate(${this.margemHorizontal}, 0)`)
            .attr("class", "grid")
            .call(gridY.tickSize(-(this.largura - (this.margemHorizontal*2) - 30)).tickFormat(''));

        this.svg.append("g")
            .attr("transform", `translate(0, ${this.altura - this.margemVertical})`)
            .call(eixoX);
        this.svg.append("g")
            .attr("transform", `translate(${this.margemHorizontal}, 0)`)
            .call(eixoY);
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

    atribuiDados(dados) {
        this.dados.push(dados)        
        if (this.dados.length == 1) {
            this.criaMargens()
        }
        this.group.push(d3.select('#svg').append('g'))
    }
}

class Histograma extends Grafico {
    constructor() {
        super()        
    }
}

class ScatterPlot extends Grafico {
    constructor() {
        super(700, 700)
        this.dados = []
        this.group = []
    }

    atribuiDados(dados) {
        /* this.dados.push(dados)        
        if (this.dados.length == 1) {
            this.criaMargens()
        }
        this.group.push(d3.select('#svg').append('g')) */
        super.atribuiDados(dados)
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
                    .attr('stroke', cores[i])
                    .attr('fill', cores[i]);
            }
            i++
        }
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
        super(700, 700)
        this.dados = []
        this.group = []
    }

    atribuiDados(dados) {
        super.atribuiDados(dados)
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
                .attr('fill', 'transparent');
            i++
        }
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