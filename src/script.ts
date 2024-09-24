class Registrant {
    constructor(
        public name: string,
        public age: number,
        public money: number
    ) {}
}

class RegistrationSystem {
    private registrants: Registrant[] = this.loadFromLocalStorage();

    public async register(name: string, age: number, money: number): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (name.length < 10) {
                    reject("Nama minimal 10 karakter.");
                } else if (age < 25) {
                    reject("Umur minimal 25 tahun.");
                } else if (money < 100000 || money > 1000000) {
                    reject("Uang sangu harus antara 100 ribu dan 1 juta.");
                } else {
                    const newRegistrant = new Registrant(name, age, money);
                    this.registrants.push(newRegistrant);
                    this.saveToLocalStorage();
                    resolve("Registrasi berhasil.");
                }
            }, 500);
        });
    }

    private saveToLocalStorage(): void {
        localStorage.setItem("registrants", JSON.stringify(this.registrants));
    }

    private loadFromLocalStorage(): Registrant[] {
        const data = localStorage.getItem("registrants");
        return data ? JSON.parse(data).map((item: any) => new Registrant(item.name, item.age, item.money)) : [];
    }

    public getAverageData(): { averageMoney: number; averageAge: number } {
        const totalMoney = this.registrants.reduce((acc, curr) => acc + curr.money, 0);
        const totalAge = this.registrants.reduce((acc, curr) => acc + curr.age, 0);
        const averageMoney = totalMoney / this.registrants.length || 0;
        const averageAge = totalAge / this.registrants.length || 0;

        return { averageMoney, averageAge };
    }

    public getRegistrants(): Registrant[] {
        return this.registrants;
    }
}

const registrationSystem = new RegistrationSystem();

document.getElementById("registrationForm")!.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const nameElement = document.getElementById("name") as HTMLInputElement;
    const ageElement = document.getElementById("age") as HTMLInputElement;
    const moneyElement = document.getElementById("money") as HTMLInputElement;

    const name = nameElement.value;
    const age = parseInt(ageElement.value);
    const money = parseInt(moneyElement.value);
    const formMessage = document.getElementById("formMessage")!;

    try {
        const message = await registrationSystem.register(name, age, money);
        formMessage.textContent = message;
        formMessage.style.color = "green";
        updateRegistrantList();
        nameElement.value = '';
        ageElement.value = '';
        moneyElement.value = '';
    } catch (error) {
        formMessage.textContent = error as string; // Casting error to string
        formMessage.style.color = "red";
    }
});

function updateRegistrantList() {
    const registrantsList = document.getElementById("registrantsList")! as HTMLTableElement;
    registrantsList.innerHTML = "";
    const registrants = registrationSystem.getRegistrants();

    registrants.forEach((registrant) => {
        const row = registrantsList.insertRow();
        row.insertCell(0).textContent = registrant.name;
        row.insertCell(1).textContent = registrant.age.toString();
        row.insertCell(2).textContent = registrant.money.toString();
    });

    updateResume();
}

function updateResume() {
    const { averageMoney, averageAge } = registrationSystem.getAverageData();
    const resume = document.getElementById("resume")!;
    resume.textContent = `Rata-rata pendaftar memiliki uang sangu sebesar ${averageMoney.toFixed(2)} dengan rata-rata umur ${averageAge.toFixed(2)}.`;
}

function showTab(tab: string) {
    const registerTab = document.getElementById("register")!;
    const listTab = document.getElementById("list")!;
    
    if (tab === "register") {
        registerTab.style.display = "block";
        listTab.style.display = "none";
    } else {
        registerTab.style.display = "none";
        listTab.style.display = "block";
        updateRegistrantList();
    }
}

showTab('register');
