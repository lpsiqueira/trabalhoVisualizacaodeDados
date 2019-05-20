'use strict';

class Grafico {
    constructor (altura=500, largura=500) {
        this.altura = altura
        this.largura = largura
        this.margemVertical = 50
        this.margemHorizontal = 50

        this.svg = this.criaSVG()
        
        this.scalaX = d3.scaleLinear()
            .domain([0, this.largura - this.margemVertical*2])
            .range([0, this.largura - this.margemVertical*2])
        this.scalaY = d3.scaleLinear()
            .domain([this.altura - this.margemHorizontal*2, 0])
            .range([0, this.altura - this.margemHorizontal*2])

        
        this.criaMargens()
    }

    criaMargens() {
        let eixoX = d3.axisBottom().scale(this.scalaX)
        let eixoY = d3.axisLeft().scale(this.scalaY)

        this.svg.append("g")
            .attr("transform", `translate(${this.margemHorizontal}, ${this.altura - this.margemVertical})`)
            .call(eixoX);
        this.svg.append("g")
            .attr("transform", `translate(${this.margemHorizontal}, 50)`)
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
}

let el = new Grafico(1000, 1000)

class Histograma extends Grafico {
    constructor() {
        super()
    }
}

class ScatterPlot extends Grafico {
    constructor() {
        super()
    }
}

class Serie extends Grafico {
    constructor() {
        super()
    }
}