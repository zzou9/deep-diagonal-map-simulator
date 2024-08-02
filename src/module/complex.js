/**
 * A class that stores operations for complex numbers
 */

class Complex {
    
    constructor(x, y) {
        this.re = x;
        this.im = y;
    }

    static add(z1, z2) {
        return new Complex(z1.re + z2.re, z1.im + z2.im);
    }

    static sub(z1, z2) {
        return new Complex(z1.re - z2.re, z1.im - z2.im);
    }

    static mult(z1, z2) {
        const x = z1.re * z2.re - z1.im * z2.im;
        const y = z1.re * z2.im + z1.im * z2.re;
        return new Complex(x, y);
    }

    static div(z1, z2) {
        if (z2.re == 0 && z2.im == 0) {
            return NaN;
        }
        const x = (z1.re * z2.re + z1.im * z2.im) / (z2.re * z2.re + z2.im * z2.im);
        const y = (z1.im * z2.re - z1.re * z2.im) / (z2.re * z2.re + z2.im * z2.im);
        return new Complex(x, y);
    } 

    toString(rounding=5) {
        if (this.im < 0) {
            return MathHelper.round(this.re, rounding).toString() + " - " + MathHelper.round(-this.im, rounding).toString() + "i";
        }
        return MathHelper.round(this.re, rounding).toString() + " + " + MathHelper.round(this.im, rounding).toString() + "i";
    }
}