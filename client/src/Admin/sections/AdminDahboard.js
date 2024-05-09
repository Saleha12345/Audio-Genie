import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import "../../styles/AdminDashboard.css"; 

const AdminDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [basicCount, setBasicCount] = useState(0);
  const [standardCount, setStandardCount] = useState(0);
  const [premiumCount, setPremiumCount] = useState(0);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState([]);
  const [activeCount, setactiveCount] = useState(0);
  const [countriesData, setCountriesData] = useState({
    labels: [],
    data: [],
  });

  useEffect(() => {
    fetchUsers();
    fetchMonthlyRegistrations();
    fetchCountries();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/users");
      if (response.status === 200) {
        const users = response.data;
        setUserData(users);
        setUserCount(users.length);
        countSubscriptions(users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
 

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/active-users');
        setactiveCount(response.data.length);
        console.log(activeCount)
      } catch (error) {
        console.error('Error fetching active users:', error);
      }
    };

    fetchActiveUsers();
  }, []);

  const countSubscriptions = (users) => {
    let basic = 0;
    let standard = 0;
    let premium = 0;
    users.forEach((user) => {
      switch (user.plan) {
        case "Basic":
          basic++;
          break;
        case "Standard":
          standard++;
          break;
        case "Premium":
          premium++;
          break;
        default:
          break;
      }
    });
    setBasicCount(basic);
    setStandardCount(standard);
    setPremiumCount(premium);
    setSubscriptionData([basic, standard, premium]);
  };

  const subscriptionChart = {
    labels: ["Basic", "Standard", "Premium"],
    datasets: [
      {
        label: "Subscriptions",
        data: subscriptionData,
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const fetchMonthlyRegistrations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/monthlyRegistrations"
      );
      if (response.status === 200) {
        setMonthlyRegistrations(response.data);
      }
    } catch (error) {
      console.error("Error fetching monthly registrations:", error);
    }
  };

  const processData = () => {
    const dataByMonth = {};

    for (let i = 1; i <= 12; i++) {
      dataByMonth[i] = 0;
    }

    monthlyRegistrations.forEach(({ month, count }) => {
      dataByMonth[month] = count;
    });

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const labels = monthNames.map((month, index) => `${month}`);
    const data = Object.values(dataByMonth);

    return { labels, data };
  };

  const chartData = {
    labels: processData().labels,
    datasets: [
      {
        label: "Registrations",
        data: processData().data,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get("http://localhost:3001/userCountries");
      if (response.status === 200) {
        const countries = response.data;

        setCountriesData({
          labels: countries.labels,
          data: countries.data,
        });
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };



  const countryChart = {
    labels: countriesData.labels,
    datasets: [
      {
        data: countriesData.data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(153, 102, 255, 0.7)",
          "rgba(255, 159, 64, 0.7)",
          "rgba(255, 99, 132, 0.7)",
          "rgba(54, 162, 235, 0.7)",
          "rgba(255, 206, 86, 0.7)",
          "rgba(75, 192, 192, 0.7)",
        ],
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <div className="card-small">
        <div className="total-users-card card">
          <img src={require('../../img/total-users.png')} alt="total users" className="users" />
          <h2 className="total-users-title"> {userCount} Users</h2>
        </div>
        <div className="total-users-card card">
        <img src={require('../../img/total-sub.png')} alt="total users" className="users" />
          <h2 className="total-users-title">{userCount} Subscriptions</h2>
        </div>
        <div className="total-users-card card">
        <img src={require('../../img/active-users.png')} alt="total users" className="users" />
          <h2 className="total-users-title">{activeCount} Active</h2>
        </div>
      </div>
      <div className="">
        <div className="charts-container">
          <div className="subscription-chart card-graph">
            <h2 className="graph-title">Subscriptions</h2>
            <Bar
              data={subscriptionChart}
              options={{
                scales: {
                  yAxes: [
                    {
                      ticks: {
                        beginAtZero: true,
                      },
                    },
                  ],
                },
              }}
            />
          </div>
          <div className="countries-chart card-graph">
            <h2>Countries data</h2>
            <Pie data={countryChart} />
          </div>
          
        </div>
        <div className="">
          
          <div className="monthly-registrations-chart card-graph">
            <h2 className="graph-title">Monthly Registrations</h2>
            <Bar 
              data={chartData}
              options={{
                scales: {
                  xAxes: [
                    {
                      stacked: true,
                      ticks: {
                        autoSkip: false,
                        maxRotation: 0,
                        minRotation: 0,
                      },
                    },
                  ],
                  yAxes: [{ stacked: true }],
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
