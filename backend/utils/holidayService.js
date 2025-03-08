const axios = require('axios');

const checkHoliday = async (date) => {
  try {
    const year = date.getFullYear();
    const country = "US";

    console.log(`Checking holiday for: ${date.toISOString().split("T")[0]}`);

    const response = await axios.get(
      `https://calendarific.com/api/v2/holidays?api_key=${process.env.CALENDARIFIC_API_KEY}&country=${country}&year=${year}`
    );

    console.log("API Response:", JSON.stringify(response.data, null, 2));

    const holidays = response.data.response.holidays || [];
    const dateString = date.toISOString().split("T")[0];

    const isHoliday = holidays.some(
      (holiday) => holiday.date.iso === dateString
    );
    console.log(`Is ${dateString} a holiday? ${isHoliday}`);

    return isHoliday;
  } catch (error) {
    console.error(
      "Holiday check failed:",
      error.response?.data || error.message
    );
    return false;
  }
};

module.exports = { checkHoliday };