import React, { useEffect, useState } from "react";
import { Table, Spin, Typography, Pagination } from "antd";
import "../index.css";
import {
  CalendarOutlined,
  BarChartOutlined,
  PercentageOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

function SectorInteractionAnalyzer() {
  // State to store the fetched data
  const [data, setData] = useState([]);

  // Fetch data from the API endpoint when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch("https://substantive.pythonanywhere.com");
      const jsonData = await response.json();
      setData(jsonData.interactions);
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // Render the table with the interaction dates and percentages
  const interactionsTable = () => {
    // Calculate total number of interactions
    const totalInteractions = data.length;
    // Track the count of interactions for each sector
    const sectorCounts = {};

    // Count interactions for each sector
    for (let i = 0; i < data.length; i++) {
      const interaction = data[i];
      const sector = interaction.name;
      sectorCounts[sector] = (sectorCounts[sector] || 0) + 1;
    }

    // Prepare table data with date, sector, and percentage
    const tableData = data.map((interaction, index) => {
      const sector = interaction.name;
      const count = sectorCounts[sector];
      const percentage = ((count / totalInteractions) * 100).toFixed(2);

      return {
        key: index,
        date: interaction.date,
        sector: sector,
        percentage: percentage,
      };
    });

    // Define available page sizes for pagination
    const pageSizeOptions = ["10", "20", "50"];

    // Configure pagination options
    const paginationConfig = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: pageSizeOptions,
      showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    };

    // Define table columns
    const columns = [
      {
        title: (
          <span style={{ fontSize: "20px" }}>
            <CalendarOutlined /> Date
          </span>
        ),
        dataIndex: "date",
        key: "date",
        align: "center",
        className: "table-col",
      },
      {
        title: (
          <span style={{ fontSize: "20px" }}>
            <BarChartOutlined /> Sector
          </span>
        ),
        dataIndex: "sector",
        key: "sector",
        align: "center",
        className: "table-col",
      },
      {
        title: (
          <span style={{ fontSize: "20px" }}>
            <PercentageOutlined /> Percentage
          </span>
        ),
        dataIndex: "percentage",
        key: "percentage",
        align: "center",
        className: "table-col",
      },
    ];

    return (
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          display: "flex",
          justifyContent: "center",
        }}>
        <div style={{ maxWidth: "1000px", width: "100%" }}>
          <Table
            dataSource={tableData}
            columns={columns}
            className="custom-table"
            pagination={paginationConfig}
          />
        </div>
      </div>
    );
  };

  // Render the component
  return (
    <div
      className="container"
      style={{ padding: "0 120px" }}>
      <Title
        level={2}
        style={{ color: "#1890ff", marginBottom: "16px" }}>
        Sector Interaction Analyzer
      </Title>
      <Paragraph
        style={{
          color: "#000",
          marginBottom: "24px",
          fontSize: "20px",
          padding: "0 10px",
        }}>
        The data displayed is a breakdown of the percentage of interactions
        within each sector and includes the date of the interaction, the sector
        it belongs and the percentage of interactions within each sector,
      </Paragraph>
      {data.length > 0 ? interactionsTable() : <Spin tip="Loading data..." />}
    </div>
  );
}

export default SectorInteractionAnalyzer;
