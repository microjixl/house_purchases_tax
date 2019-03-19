class House {
    constructor(isCommon, isFirst, hasLoan, isSingle, isRelocate, houseAge, area, agency, lastPrice, totalPrice) {
        this.isCommon = isCommon;
        this.isFirst = isFirst;
        this.hasLoan = hasLoan;
        this.isSingle = isSingle;
        this.isRelocate = isRelocate;
        this.houseAge = houseAge;
        this.area = area;
        this.agency = agency;
        this.lastPrice = lastPrice;
        this.totalPrice = totalPrice;
        this.buyer = { deedTax: 0, agencyCost: 0, initPayment: 0 };
        this.seller = { incrementTax: 0, additionalTax: 0, incomeTax: 0 };

        if (this.totalPrice < this.lastPrice) {
            this.lastPrice = this.totalPrice;
        }
    }

    buyerPay() {
        return this.buyer.deedTax + this.buyer.agencyCost + this.buyer.initPayment;
    }

    sellerPay() {
        return this.seller.incrementTax + this.seller.additionalTax + this.seller.incomeTax;
    }

    totalPay() {
        return this.buyerPay() + this.sellerPay();
    }

    initPaymentCalculate() {
        var ratio = 0.35;

        if (isFirst == 1 && hasLoan == 0) {
            //首套房
            this.initPaymentDescription = '无房无贷款记录,首付=核定价*35%';
            ratio = 0.35;
        } else {
            //二套
            if (isFirst != 1) {
                this.initPaymentDescription = '二套房,';
            } else {
                this.initPaymentDescription = '无房有贷款记录算二套,';
            }

            if (isCommon == 1) {
                ratio = 0.5;
                this.initPaymentDescription += '普通住宅，首付=核定价*50%';
            } else {
                ratio = 0.7;
                this.initPaymentDescription += '非普通住宅，首付=核定价*70%';
            }
        }

        return totalPrice * ratio;
    }

    deedTaxCalculate(incrementTax) {
        var ratio = 0.01;

        if (isFirst == 1) {
            if (area <= 90) {
                ratio = 0.01;
                this.deedTaxDescription = '首套普通住宅，契税=(核定价-增值税)*1%';
            } else {
                ratio = 0.015;
                this.deedTaxDescription = '首套非普通住宅，契税=(核定价-增值税)*1.5%';
            }
        } else {
            ratio = 0.03;
            this.deedTaxDescription = '非首套房，契税=(核定价-增值税)*3%';
        }

        return (totalPrice - incrementTax) * ratio
    }

    agencyCostCalculate() {
        var ratio = 0.01;
        switch (agency) {
            case '1':
                ratio = 0.01;
                this.agencyCostDescription = '中介费=核定价*1%';
                break;
            case '2':
                ratio = 0.02;
                this.agencyCostDescription = '中介费=核定价*2%';
                break;
            case '3':
                ratio = 0.03;
                this.agencyCostDescription = '中介费=核定价*3%';
                break;
            case '4':
                ratio = 0.04;
                this.agencyCostDescription = '中介费=核定价*4%';
                break;
        }
        return totalPrice * ratio;
    }

    incrementTaxCalculate() {
        if (totalPrice <= lastPrice) {
            this.incrementTaxDescription = '核定价小于买入价，没没有增值税';
            return 0;
        }

        //动迁房不交增值税
        if (isRelocate == 1) {
            this.incrementTaxDescription = '动迁房没有增值税';
            return 0;
        }

        var base = totalPrice;
        if (houseAge >= 2) {
            if (isCommon == 1) {
                this.incrementTaxDescription = '满两年唯一没有增值税';
                return 0;
            } else {
                base = totalPrice - lastPrice;
                this.incrementTaxDescription = '满两年不唯一，增值税=(核定价-买入价)/1.05*5%';
            }
        } else {
            this.incrementTaxDescription = '不满两年，增值税=核定价/1.05*5%';
        }
        return base / 1.05 * 0.05;
    }

    additionalTaxCalculate(incrementTax) {
        //动迁房不交附加税
        if (isRelocate == 1) {
            this.additionalTaxDescription = '动迁房没有附加税';
            return 0;
        }
        this.additionalTaxDescription = '附加税 = 增值税 / 5% * 0.3%';
        return incrementTax / 0.05 * 0.003;
    }

    incomeTaxCalculate(incrementTax, additionalTax) {
        if (houseAge >= 5 && isSingle == 1) {
            this.incomeTaxDescription = '满五唯一没有个税';
            return 0;
        }
        //动迁房1%个税
        if (isRelocate == 1) {
            this.incomeTaxDescription = '不满五唯一，动迁房,个税=(核定价-增值税)*1%';
            return totalPrice * 0.01;
        }

        var ratio = 0.01;
        if (isCommon != 1) {
            this.incomeTaxDescription = '不满五唯一，非普通住宅,个税=(核定价-增值税)*2%';
            ratio = 0.02;
        } else {
            this.incomeTaxDescription = '不满五唯一，普通住宅,个税=(核定价-增值税)*1%';
        }
        var ratioCost = (totalPrice - incrementTax) * ratio;
        var profit = (totalPrice - lastPrice - incrementTax - additionalTax) * 0.2;

        if (ratioCost < profit) {
            return ratioCost;
        } else {
            this.incomeTaxDescription += '或利润*20%，个税=利润的20%';
            return profit;
        }
    }

    calculateTax() {
        this.seller.incrementTax = Math.floor(this.incrementTaxCalculate());
        this.seller.additionalTax = Math.floor(this.additionalTaxCalculate(this.seller.incrementTax));
        this.seller.incomeTax = Math.floor(this.incomeTaxCalculate(this.seller.incrementTax, this.seller.additionalTax));
        this.buyer.deedTax = Math.floor(this.deedTaxCalculate(this.seller.incrementTax));
        this.buyer.agencyCost = Math.floor(this.agencyCostCalculate());
        this.buyer.initPayment = Math.floor(this.initPaymentCalculate());
    }

}
