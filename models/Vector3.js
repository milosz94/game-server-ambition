module.exports = class Vector3 {
    constructor(X=0,Y=0,Z=0)
    {
        this.x = X;
        this.y = Y;
        this.z = Z;
    }
    Magnitude(){
        return Math.sqrt((this.x*this.x) + (this.y * this.y)  + (this.z * this.z));
    }
    Normalized(){
        var m = this.Magnitude();
        return new Vector3(this.x/m, this.y/m,this.z/m );
    }
    Distance(OtherVector,Vector3)
    {
            var direction = new Vector3();
            direction.x = OtherVector.x - this.x;
            direction.y = OtherVector.y - this.y;
            direction.z = OtherVector.z - this.z;
            return direction.Magnitude();
    }
    ConsoleOutput()
    {
        return '(' + this.x + "," + this.y +"," + this.z + ')';
    }
    toJson()
    {
        var vector = {
            "x" : this.x,
            "y" : this.y,
            "z" : this.z
        };
        return JSON.stringify(vector);
    }
    toJavaScriptObject()
    {
        var vector = {
            "x" : this.x,
            "y" : this.y,
            "z" : this.z
        };
        return vector;
    }

};