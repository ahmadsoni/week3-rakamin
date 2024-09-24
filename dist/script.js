"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Registrant {
    constructor(name, age, money) {
        this.name = name;
        this.age = age;
        this.money = money;
    }
}
class RegistrationSystem {
    constructor() {
        this.registrants = this.loadFromLocalStorage();
    }
    register(name, age, money) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (name.length < 10) {
                        reject("Nama minimal 10 karakter.");
                    }
                    else if (age < 25) {
                        reject("Umur minimal 25 tahun.");
                    }
                    else if (money < 100000 || money > 1000000) {
                        reject("Uang sangu harus antara 100 ribu dan 1 juta.");
                    }
                    else {
                        const newRegistrant = new Registrant(name, age, money);
                        this.registrants.push(newRegistrant);
                        this.saveToLocalStorage();
                        resolve("Registrasi berhasil.");
                    }
                }, 500);
            });
        });
    }
    saveToLocalStorage() {
        localStorage.setItem("registrants", JSON.stringify(this.registrants));
    }
    loadFromLocalStorage() {
        const data = localStorage.getItem("registrants");
        return data ? JSON.parse(data).map((item) => new Registrant(item.name, item.age, item.money)) : [];
    }
    getAverageData() {
        const totalMoney = this.registrants.reduce((acc, curr) => acc + curr.money, 0);
        const totalAge = this.registrants.reduce((acc, curr) => acc + curr.age, 0);
        const averageMoney = totalMoney / this.registrants.length || 0;
        const averageAge = totalAge / this.registrants.length || 0;
        return { averageMoney, averageAge };
    }
    getRegistrants() {
        return this.registrants;
    }
}
const registrationSystem = new RegistrationSystem();
document.getElementById("registrationForm").addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const nameElement = document.getElementById("name");
    const ageElement = document.getElementById("age");
    const moneyElement = document.getElementById("money");
    const name = nameElement.value;
    const age = parseInt(ageElement.value);
    const money = parseInt(moneyElement.value);
    const formMessage = document.getElementById("formMessage");
    try {
        const message = yield registrationSystem.register(name, age, money);
        formMessage.textContent = message;
        formMessage.style.color = "green";
        updateRegistrantList();
        nameElement.value = '';
        ageElement.value = '';
        moneyElement.value = '';
    }
    catch (error) {
        formMessage.textContent = error; // Casting error to string
        formMessage.style.color = "red";
    }
}));
function updateRegistrantList() {
    const registrantsList = document.getElementById("registrantsList");
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
    const resume = document.getElementById("resume");
    resume.textContent = `Rata-rata pendaftar memiliki uang sangu sebesar ${averageMoney.toFixed(2)} dengan rata-rata umur ${averageAge.toFixed(2)}.`;
}
function showTab(tab) {
    const registerTab = document.getElementById("register");
    const listTab = document.getElementById("list");
    if (tab === "register") {
        registerTab.style.display = "block";
        listTab.style.display = "none";
    }
    else {
        registerTab.style.display = "none";
        listTab.style.display = "block";
        updateRegistrantList();
    }
}
showTab('register');
