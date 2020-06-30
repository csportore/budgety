let BudgetController = (function() {

    let data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,

        percentage: -1
    };

    // Capital letters for Constructors
    let Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }

    let Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    let calculateTotal = function(type) {
        let sum = 0;
        data.allItems[type].forEach(function (current) {
            sum += current.value;
        });

        data.totals[type] = sum;
    };

    return {
        addItem: function(type, description, value) {
            let newItem, ID, lastItem;
            lastItem = data.allItems[type];
            
            ID = lastItem.length != 0 ? lastItem[lastItem.length - 1].id + 1 : 0;

            if (type === 'expense') {
                newItem = new Expense(ID, description, value);
            } else {
                newItem = new Income(ID, description, value);
            }

            data.allItems[type].push(newItem);

            return newItem;
        },

        deleteItem: function (type, id) {
            console.log(type);
            let ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            let index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function() {
            calculateTotal('expense');
            calculateTotal('income');

            data.budget = data.totals.income - data.totals.expense;
            
            if (data.totals.income > 0) {
                data.percentage = data.totals.expense / data.totals.income * 100;
            } else {
                data.percentage = -1;
            }
        },
        calculatePercentages: function() {
            data.allItems.expense.forEach(function (current) {
                current.calculatePercentage(data.totals.income);
            });
        },
        getPercentages: function() {
            let allPercentages = data.allItems.expense.map(function (current) {
                return current.getPercentage();
            });

            return allPercentages;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalIncome: data.totals.income,
                totalExpenses: data.totals.expense,
                percentage: data.percentage
            }
        },

        testing: function() {
            console.log(data);
        }
    }

})();

let UIController = (function() {
    let DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        btnAdd: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container.clearfix',
        listItemWrapper: '.item.clearfix',
        expensesPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };

    let nodeListForEach = function(list, callback) {
        for(let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },

        addListItem: function (obj, type) {
            let html, element;
            if (type === 'income') {
                element = DOMStrings.incomeContainer;
                html = `<div class="item clearfix" id="income-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            } else {
                element = DOMStrings.expensesContainer;
                html = `<div class="item clearfix" id="expense-%id%">
                    <div class="item__description">%description%</div>
                    <div class="right clearfix">
                        <div class="item__value">%value%</div>
                        <div class="item__percentage">21%</div>
                        <div class="item__delete">
                            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                        </div>
                    </div>
                </div>`;
            }

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', this.formatNumber(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },

        deleteListItem: function(selectorID) {
            let element = document.getElementById(selectorID);
            element.parentNode.removeChild(element);
        },

        formatNumber: function(num, type) {

            let sign = '';

            if (num !== 0) {
                if (type) {
                    sign = type === 'income' ? '+' : '-';
                } else {
                    sing = num >= 0 ? '+' : '-';
                }
            }

            let numSplit = Math.abs(num).toFixed(2).split('.');
            
            let intNumLength = numSplit[0].length;
        
            if (intNumLength > 3) {
                let wholeBlocks = Math.floor(intNumLength / 3);
                let numbersOutOfBlock = Math.floor(intNumLength % 3);
                let finalNumber = '';
        
                let factor = intNumLength;
                for (let i = wholeBlocks; i > 0; i--) {
                    let block = numSplit[0].substring(factor, (factor - 3));
                    finalNumber = block + finalNumber;
                    if (i - 1 != 0) {
                        finalNumber = '.' + finalNumber;
                    }
                    factor -= 3;
                }
        
                if (numbersOutOfBlock) {
                    let lastNumbers = numSplit[0].substr(0, numbersOutOfBlock);
                    finalNumber = lastNumbers + '.' +finalNumber;
                } 
        
                numSplit[0] = finalNumber;
            }
            let resultado = sign + numSplit[0] + ',' + numSplit[1];
            
            console.log(resultado);
        
            return resultado;
        },

        getDOMStrings: function() {
            return DOMStrings;
        },

        displayBudget: function(obj) {
            document.querySelector(DOMStrings.budgetLabel).textContent = this.formatNumber(obj.budget);
            document.querySelector(DOMStrings.incomeLabel).textContent = this.formatNumber(obj.totalIncome, 'income');
            document.querySelector(DOMStrings.expensesLabel).textContent = this.formatNumber(obj.totalExpenses, 'expense');
            
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = Math.round(obj.percentage) + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentage: function (percentages) {
            let fields = document.querySelectorAll(DOMStrings.expensesPercentageLabel);
            
            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0 ) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function(){
            
            let now = new Date();
            let year = now.getFullYear();
            let month = now.getMonth();
            let monthName = now.toLocaleString('en-us', { month: 'long' });
            
            document.querySelector(DOMStrings.dateLabel).textContent = monthName + ' ' + year;
        },

        changeType: function () {
            let fields = document.querySelectorAll(
                DOMStrings.inputType + ',' + 
                DOMStrings.inputDescription + ',' + 
                DOMStrings.inputValue
                );
            console.log(fields);
            nodeListForEach(fields, function (current) {
                current.classList.toggle('red-focus');
            });

            document.querySelector(DOMStrings.btnAdd).classList.toggle('red');

        },

        clearFields: function () {
            let fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue);
            let fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach(function(element, index, array) {
                element.value = "";
            });
            
            fieldsArray[0].focus();
        }
    };
})();

let Controller = (function (BudgetController, UIController) {

    let setupEventListeners = function() {
        document.querySelector(DOM.btnAdd).addEventListener('click', controlAddItem);

        document.addEventListener('keypress', function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                controlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', controlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UIController.changeType);
    
    }

    let DOM = UIController.getDOMStrings();

    let controlAddItem = function() {

        let input, newItem;

        // 1. Get the field input data
        input = UIController.getInput();

        // Tratamento do input
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = BudgetController.addItem(input.type, input.description, input.value);
            
            BudgetController.testing();
            // 3. Add the item to the UI
            UIController.addListItem(newItem, input.type);

            // 4. Clear the fields
            UIController.clearFields();

            // 5. Calculate and update the budget
            updateBudget();

            updatePercentages();
        }

    };

    let controlDeleteItem = function (event) {
        // console.log(event.target.closest(DOM.container));
        // let container = event.target.closest(DOM.container);
        let wrapperID = event.target.closest(DOM.listItemWrapper).id;
        
        if (wrapperID) {
            let splitID = wrapperID.split('-');
            let type = splitID[0];
            let ID = parseInt(splitID[1]);
            
            BudgetController.deleteItem(type, ID);
            
            UIController.deleteListItem(wrapperID);
            
            updateBudget();

            updatePercentages();
        }

    };

    var updateBudget = function()
    {
        // 5. Calculate the budget
        BudgetController.calculateBudget();

        // 6. Return the budget
        let budget = BudgetController.getBudget();
        console.log(budget);

        // 7. Display the budget on the UI
        UIController.displayBudget(budget);
    };

    let updatePercentages = function () {
        BudgetController.calculatePercentages();

        let percentages = BudgetController.getPercentages();
        
        console.log(percentages);
        UIController.displayPercentage(percentages);
    };

    return {
        init: function () {
            console.log('Application has started.');
            UIController.displayBudget({
                budget: 0,
                totalIncome: 0,
                totalExpenses: 0,
                percentage: -1
            });
            setupEventListeners();
            UIController.displayMonth();
        }
    }

    
})(BudgetController, UIController);

Controller.init();