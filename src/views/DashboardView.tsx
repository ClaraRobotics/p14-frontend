import { useApi } from '@/api/useApi';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import UCIlogo from '@/assets/customer/UCI.jpg';

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: #FFFFFF;
  background-color: #191970;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  font-size: 30px;
`;

const Panel1 = styled.div`
  flex: 1;
  padding: 20px;
`;

const RowPanel1 = styled(Panel1)`
  display: flex;
  flex-direction: row;
  padding-top: 90px;
`;

const Panel1WithoutPadding = styled(Panel1)`
  padding: 0;
`;

const BorderedPanel1 = styled(Panel1)`
  border-top: 5px solid #F0E68C;
  border-left: 5px solid #F0E68C;
  font-size: 40px;
`;

const Panel2 = styled.div`
  flex: 2;
`;

const TopPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const MidPanel = styled.div`
  flex: 1;
  padding: 10px;
`;

const BotPanel = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
`;

const StyledTable = styled.table`
  height: 100%;
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
  }

  td {
    font-size: 80px;
  }

  td.size-text {
    font-size: 35px;
  }

  td.yellow-text {
    color: #F0E68C;
  }
`;

const Total = styled.div`
  font-size: 60px;
`;

const PercentText = styled(Total)`
  color: #F0E68C;
`;

const YellowNumber = styled.span`
  color: #F0E68C;
`;

const DashboardView = () => {
  const currentDate = new Date();

  const thaiDateOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
  const {
    apiState: apiStateDashboardData,
    data: dashboardData,
    execute: executeDashboardData,
  } = useApi('/logging/get-current-report', 'POST');

  useEffect(() => {
    executeDashboardData();
    const intervalId = setInterval(() => {
      executeDashboardData();
      console.log('fetch data')
    }, 5000);
    // return () => {
    //   clearInterval(intervalId);
    // };
  }, []);
  return (
    <DashboardWrapper>
      <TopPanel>
        <Panel1>
          <div>สถิติปะกาวที่ออกท้ายไลน์วันนี้</div>
          <div>
            วันที่ {currentDate.toLocaleDateString('th-TH', thaiDateOptions)}
          </div>
        </Panel1>
        <Panel1>
          <img src={UCIlogo} width={400} />
        </Panel1>
      </TopPanel>

      <MidPanel>
        <StyledTable>
          <thead>
            <th>กะ</th>
            <th>เวลาที่หุ่นยนต์ทำงาน</th>
            <th>เวลาทั้งกะ(หักเวลาพัก)</th>
            <th>%การทำงาน</th>
            <th>มัด/นาที</th>
            <th>(แผ่น/นาที)</th>
          </thead>
          <tbody>
            <tr>
              <td className="size-text">เช้า</td>
              <td>{dashboardData?.day_total_count}</td>
              <td>8:00</td>
              <td className="yellow-text">N/A%</td>
              <td className="yellow-text">0</td>
              <td className="yellow-text">(0)</td>
            </tr>
            <tr>
              <td className="size-text">ดึก</td>
              <td>{dashboardData?.night_total_count}</td>
              <td>8:00</td>
              <td className="yellow-text">N/A%</td>
              <td className="yellow-text">0</td>
              <td className="yellow-text">(0)</td>
            </tr>
          </tbody>
        </StyledTable>
      </MidPanel>

      <BotPanel>
        <RowPanel1>
          <Panel2>
            <div>กะปัจจุบัน</div>
            <Total>{dashboardData?.current_total_count} แผ่น</Total>
          </Panel2>

          <Panel1WithoutPadding>
            <div>การทำงาน</div>
            <PercentText>0%</PercentText>
          </Panel1WithoutPadding>
        </RowPanel1>

        {/* <BorderedPanel1>
          <Total>กะนี้</Total>
          <div>
            <YellowNumber>0</YellowNumber> มัด ( <YellowNumber>0</YellowNumber>{' '}
            แผ่น)
          </div>
          <div>SW : 0</div>
          <div>DW : 0</div>
        </BorderedPanel1> */}
      </BotPanel>
    </DashboardWrapper>
  );
};

export default DashboardView;
