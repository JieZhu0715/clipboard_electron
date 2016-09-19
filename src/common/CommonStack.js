class CommonStack {
    constructor(maxSize) 
    {
        this.size = 0;
        this.array = [];
        this.maxSize = maxSize;
    }

    push(element) {
        this.array.unshift(element);
        this.size = this.size + 1;
        if (this.size > this.maxSize)
        {
            this.truncate();
        }
    }

    pushElementToTopByIndex(index) 
    {
        if (index >= this.array.length) {
            console.log("Error array index: ", index);
        }
        let element = this.array[index];
        this.array = this.array.splice(index, 1);
        this.array.unshift(element);
    }

    pushElementToTopByElement(element) 
    {
        let index = this.array.indexOf(item);
        this.pushElementToTop(index);
    }

    remove(index)
    {
        this.array = this.array.splice(index, 1);
        this.size = this.size - 1;
    }

    getSize()
    {
        return this.size;
    }

    // removet the last element in the array
    truncate()
    {
        this.remove(this.size - 1);
    }

    getArray()
    {
        return this.array;
    }
}

module.exports = CommonStack;