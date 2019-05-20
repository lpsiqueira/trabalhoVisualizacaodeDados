'use strict';

class Grafico {
    constructor (altura=500, largura=500) {
        this.altura = altura
        this.largura = largura
        this.margemVertical = 50
        this.margemHorizontal = 50

        this.svg = this.criaSVG()
        
        this.dados = undefined
        this.maximos = undefined        
    }

    criaEscala() {
        this.maximos = this.valoresMaximos()

        this.scalaX = d3.scaleLinear()
            .domain([0, this.maximos.xMax + 50])
            .range([this.margemVertical, this.largura - this.margemVertical])
        this.scalaY = d3.scaleLinear()
            .domain([this.maximos.yMax + 50, 0])
            .range([this.margemHorizontal, this.altura - this.margemHorizontal])
    }

    criaMargens() {
        this.criaEscala()

        let eixoX = d3.axisBottom().scale(this.scalaX)
        let eixoY = d3.axisLeft().scale(this.scalaY)

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
            .style('style', 'color: black');

        return svg
    }

    valoresMaximos() {
        let xMaximo = this.dados[0].x
        let yMaximo = this.dados[0].y
        for(let ponto of this.dados) {
            if (ponto.x > xMaximo) {
                xMaximo = ponto.x
            }
            if (ponto.y > yMaximo) {
                yMaximo = ponto.y
            }            
        }
        return {xMax: xMaximo, yMax: yMaximo}
    }
}

class Histograma extends Grafico {
    constructor() {
        super()        
    }
}

class ScatterPlot extends Grafico {
    constructor(dados) {        
        super(700, 700)
        this.dados = dados
        this.criaMargens()
        this.preenche()
    }

    preenche() {
        //this.svg.selectAll('g').data([1,2,3,4]).enter().append('g')
        for(let ponto of this.dados) {
            this.svg.selectAll('circle').data(this.dados).enter().append('circle')
                .attr('cx', (d) => {return this.scalaX(d.x)})
                .attr('cy', (d) => {return this.scalaY(d.y)})
                .attr('r', 2.5)
                .attr('stroke', 'black');
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
let scatter = new ScatterPlot(vetorPontos)

class Serie extends Grafico {
    constructor() {
        super()
    }
}