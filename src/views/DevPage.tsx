import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import styles from '@/styles/styles';


const DevpageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${styles.colors.gray8};
  margin: 0px;
`;

const Devpagetext = styled.div`
  color: ${styles.colors.white};
  font-size: 50px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 850px;
`;

const ConveyorContainer = styled.div`
  display: grid;
  height: 997px;
  width: 50%;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(9, 1fr);
  background-color: ${styles.colors.gray2};
`

const Conveyor = styled.div`
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: 20px 1fr 1fr;
  background-color: ${styles.colors.gray8};
  border: 2px solid ${styles.colors.gray4};
  box-sizing: border-box;
`

const Name = styled.div`
  display: flex;
  grid-column: 1/10;
  background-color: ${styles.colors.gray5};
  font-size: 15px;
  text-align: center;
  align-items: center;
  justify-content: center;
  color: ${styles.colors.white};
  box-sizing: border-box;
`

const Pallet = styled.div`
  display: flex;
  background-color: ${styles.colors.green};
  border: 2px solid ${styles.colors.gray4};
  color: ${styles.colors.white};
  font-size: 20px;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`

const DevPage = () => {
    const conveyorItems = [];
    const pallets = [];
  
    for (let i = 0; i < 18; i++) {
      conveyorItems.push(`Conveyor ${i + 1}`);
      pallets.push(`${i + 1}`);
    }

    return (
        <DevpageContainer>
      <Devpagetext>DevPage</Devpagetext>
      <ConveyorContainer>
      {conveyorItems.map((item, index) => (
        <Conveyor key={index}>
            <Name>{item}</Name>
            {pallets.map((pallet, pIndex) => (
              <Pallet 
              style={{ backgroundColor: pallet <= 3 ? styles.colors.green : styles.colors.gray3 }}
              key={pIndex}>
                {pallet}
              </Pallet>
            ))}
          </Conveyor >
        ))}    
      </ConveyorContainer>
    </DevpageContainer>
    );
};

export default DevPage;