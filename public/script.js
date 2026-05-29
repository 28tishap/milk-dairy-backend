fetch('/dashboard')
.then(response => response.json())
.then(data => {

    document.getElementById('farmerCount').innerText =
        data.totalFarmers;

    document.getElementById('milkTotal').innerText =
        data.totalMilk + ' L';

    document.getElementById('paymentTotal').innerText =
        '₹ ' + data.totalPayments;

})
.catch(error => {
    console.log(error);
});
fetch('/farmers').then(response => response.json())
.then(data => {

    document.getElementById('farmerCount').innerText = data.length;

    let tableData = '';

    data.forEach(farmer => {

        tableData += `
            <tr>
                <td>${farmer.farmer_id}</td>
                <td>${farmer.name}</td>
                <td>${farmer.village}</td>
                <td>${farmer.phone}</td>
            </tr>
        `;
    });

    document.getElementById('farmersTable').innerHTML = tableData;

})
.catch(error => {
    console.log(error);
});
fetch('/milk')
.then(response => response.json())
.then(data => {

    let milkData = '';

    data.forEach(record => {

        milkData += `
            <tr>
                <td>${record.collection_id}</td>
                <td>${record.farmer_id}</td>
                <td>${record.quantity}</td>
                <td>${record.fat_percentage}</td>
                <td>${record.snf_percentage}</td>
                <td>${record.shift_time}</td>
                <td>${record.collection_date}</td>
            </tr>
        `;
    });

    document.getElementById('milkTable').innerHTML = milkData;

})
.catch(error => {
    console.log(error);
});
fetch('/milk-trends')
.then(response => response.json())
.then(data => {

    const labels = data.map(item => item.collection_date);
    const quantities = data.map(item => item.total_quantity);

    const ctx = document.getElementById('milkChart');

    new Chart(ctx, {

        type: 'line',

        data: {
            labels: labels,

            datasets: [{
                label: 'Daily Milk Collection (Litres)',
                data: quantities,
                borderWidth: 2
            }]
        },

        options: {
            responsive: true
        }

    });

})
.catch(error => {
    console.log(error);
});
document
.getElementById('farmerForm')
.addEventListener('submit', function(e) {

    e.preventDefault();

    const farmerData = {

        name: document.getElementById('name').value,

        village: document.getElementById('village').value,

        phone: document.getElementById('phone').value
    };

    fetch('/farmers', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(farmerData)

    })

    .then(response => response.text())

    .then(data => {

        alert(data);

        location.reload();

    })

    .catch(error => {
        console.log(error);
    });

});
document
.getElementById('milkForm')
.addEventListener('submit', function(e) {

    e.preventDefault();

    const milkData = {

        farmer_id:
            document.getElementById('farmer_id').value,

        quantity:
            document.getElementById('quantity').value,

        fat:
            document.getElementById('fat').value,

        snf:
            document.getElementById('snf').value,

        shift:
            document.getElementById('shift').value,

        date:
            document.getElementById('date').value
    };

    fetch('/milk', {

        method: 'POST',

        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(milkData)

    })

    .then(response => response.text())

    .then(data => {

        alert(data);

        location.reload();

    })

    .catch(error => {
        console.log(error);
    });

});

function scrollToSection(sectionId) {

    const section =
        document.getElementById(sectionId);

    if (section) {

        section.scrollIntoView({
            behavior: 'smooth'
        });

    }

}
document
.getElementById('searchFarmer')
.addEventListener('keyup', function() {

    const searchValue =
        this.value.toLowerCase();

    const rows =
        document.querySelectorAll('#farmersTable tr');

    rows.forEach(row => {

        const rowText =
            row.innerText.toLowerCase();

        if (rowText.includes(searchValue)) {

            row.style.display = '';

        } else {

            row.style.display = 'none';

        }

    });

});