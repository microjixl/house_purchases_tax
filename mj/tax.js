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

        if(this.totalPrice < this.lastPrice){
            this.lastPrice = this.totalPrice;
        }
    }

    initPaymentCalculate() {
        var ratio = 0.35;
        if (isFirst == 1) {
            if(hasLoan == 0){
                ratio = 0.35;
            }else{
                ratio = 0.5;
            }
        } else {
            if (isCommon == 1) {
                ratio = 0.5;
            } else {
                ratio = 0.7;
            }
        }
        return totalPrice * ratio;
    }

    deedTaxCalculate(incrementTax) {
        var ratio = 0.01;
        if (isFirst == 1) {
            if (area <= 90) {
                ratio = 0.01;
            } else {
                ratio = 0.15;
            }
        } else {
            ratio = 0.03;
        }

        return (totalPrice - incrementTax) * ratio
    }

    agencyCostCalculate() {
        var ratio = 0.01;
        switch (agency) {
            case 1:
                ratio = 0.01;
                break;
            case 2:
                ratio = 0.02;
                break;
            case 3:
                ratio = 0.03;
                break;
            case 4:
                ratio = 0.04;
                break;
        }
        return totalPrice * ratio;
    }

    incrementTaxCalculate() {
        //动迁房不交增值税
        if (isRelocate == 1) {
            return 0;
        }

        var base = totalPrice;
        if (houseAge >= 2) {
            if (isCommon == 1) {
                return 0;
            } else {
                base = totalPrice - lastPrice;
            }
        }
        return base / 1.05 * 0.05;
    }

    additionalTaxCalculate(incrementTax) {
        //动迁房不交附加税
        if (isRelocate == 1) {
            return 0;
        }

        return incrementTax / 0.05 * 0.006;
    }

    incomeTaxCalculate(incrementTax, additionalTax) {
        if (houseAge >= 5 && isSingle == 1) {
            return 0;
        }
        //动迁房1%个税
        if (isRelocate == 1) {
            return totalPrice * 0.01;
        }

        var ratio = 0.01;
        if (isCommon != 1) {
            ratio = 0.02;
        }
        var ratioCost = (totalPrice - incrementTax) * ratio;
        var profit = (totalPrice - lastPrice - incrementTax - additionalTax) * 0.2;

        if (ratioCost < profit) {
            return ratioCost;
        } else {
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
