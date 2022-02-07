const jStat = require('jstat');

export class ChiSquareTest {
  public calc(setA: any[], setB: any[]) {
    const setACategories = setA.filter((item, index, self) => self.indexOf(item) === index);
    const setBCategories = setB.filter((item, index, self) => self.indexOf(item) === index);
    const allCategories = setACategories.concat(setBCategories).filter((item, index, self) => self.indexOf(item) === index);

    let score = 0;
    let pValue = -1;

    if (allCategories.length > 1) {
      const setASize = setA.length;
      const setBSize = setB.length;
      const overallSize = setASize + setBSize;

      const table = [];
      for (const currCat of allCategories) {
        const amountSetA = setA.filter((item) => item === currCat).length;
        const amountSetB = setB.filter((item) => item === currCat).length;
        const sum = amountSetA + amountSetB;
        const setAExp = (setASize * sum) / overallSize;
        const setAChi = (amountSetA - setAExp) ** 2 / setAExp;

        const setBExp = (setBSize * sum) / overallSize;
        const setBChi = (amountSetB - setBExp) ** 2 / setBExp;
        const sumChi = setAChi + setBChi;
        const currCell = {
          category: currCat,
          setA: amountSetA,
          setAExp,
          setAChi,
          setB: amountSetB,
          setBExp,
          setBChi,
          sum,
          sumChi,
        };
        table.push(currCell);
      }

      const allChiForCategories = table.map((a) => a.sumChi);
      const chiSquare = allChiForCategories.reduce(this.getSum);
      const rows = 2; // the two sets
      const columns = table.length; // number of categories in the two sets
      const df = (rows - 1) * (columns - 1);
      // Phi
      // const phi = Math.sqrt(chiSquare/overallSize);
      // Cramer's V
      const t = Math.min(rows - 1, columns - 1);
      const cramerV = Math.sqrt(chiSquare / (overallSize * t));

      score = cramerV;
      pValue = 1 - jStat.jStat.chisquare.cdf(chiSquare, df);
    }

    return {
      scoreValue: score,
      pValue,
      setSizeA: setA.length,
      setSizeB: setB.length,
    };
  }

  public getSum(total: number, numb: number) {
    return total + numb;
  }
}
