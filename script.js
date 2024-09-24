document.addEventListener("DOMContentLoaded", () => {
    const budgetForm = document.getElementById("budget-form");
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const remainingBudget = document.getElementById("remaining-budget");
    const filterCategory = document.getElementById("filter-category");

    let expenses = [];
    let budget = 0;  // Initial budget

    budgetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        budget = parseFloat(document.getElementById("budget-amount").value);
        if (isNaN(budget) || budget <= 0) {
            alert("Please enter a valid budget amount.");
            return;
        }
        updateRemainingBudget();
        budgetForm.reset();
    });

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();
    
        const name = document.getElementById('expense-name').value;
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;
    
        if (!name || isNaN(amount) || !category || !date) {
            alert("Please fill in all fields correctly.");
            return;
        }
    
        const editingId = expenseForm.getAttribute("data-editing-id");
    
        if (editingId) {
            const expense = expenses.find(expense => expense.id === parseInt(editingId));
            budget += expense.amount;  // Add back the old amount to the budget
            expense.name = name;
            expense.amount = amount;
            expense.category = category;
            expense.date = date;
            expenseForm.removeAttribute("data-editing-id");
        } else {
            const expense = {
                id: Date.now(),
                name,
                amount,
                category,
                date
            };
            expenses.push(expense);
        }
    
        budget -= amount;  // Subtract the new amount from the budget
        displayExpenses(expenses);
        updateTotalAmount();
        updateRemainingBudget();
        expenseForm.reset();
    });

    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find(expense => expense.id === id);
            budget += expense.amount;  // Add back the deleted amount to the budget
            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
            updateRemainingBudget();
        }

        if (e.target.classList.contains("edit-btn")) {
            const id = parseInt(e.target.dataset.id);
            const expense = expenses.find(expense => expense.id === id);

            if (!expense) {
                console.error("Expense not found!");
                return;
            }

            document.getElementById("expense-name").value = expense.name;
            document.getElementById("expense-amount").value = expense.amount;
            document.getElementById("expense-category").value = expense.category;
            document.getElementById("expense-date").value = expense.date;
            expenseForm.setAttribute("data-editing-id", id);
        }
    });

    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        if (category === "All") {
            displayExpenses(expenses);
        } else {
            const filteredExpenses = expenses.filter(expense => expense.category === category);
            displayExpenses(filteredExpenses);
        }
    });

    function displayExpenses(expenses) {
        expenseList.innerHTML = "";  // Clear the list before displaying new rows
        expenses.forEach(expense => {
            const row = document.createElement("tr");

            row.innerHTML = `
            <td>${expense.name}</td>
            <td>$${expense.amount.toFixed(2)}</td>
            <td>${expense.category}</td> 
            <td>${expense.date}</td>     
            <td>
                <button class="edit-btn" data-id="${expense.id}">Edit</button>     
                <button class="delete-btn" data-id="${expense.id}">Delete</button>     
            </td>   
            `;

            expenseList.appendChild(row);
        });
    }

    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = `Total: $${total.toFixed(2)}`;
    }

    function updateRemainingBudget() {
        remainingBudget.textContent = `Remaining Budget: $${budget.toFixed(2)}`;
    }

    // Initial display of remaining budget
    updateRemainingBudget();
});
