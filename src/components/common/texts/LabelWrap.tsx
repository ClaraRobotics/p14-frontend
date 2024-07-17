import React from 'react';
import styles from '@/styles/styles';
import styled from 'styled-components';

interface DataTextProps{

}
const DataTextContainer = styled.div`


`;

const DataText = (props: React.PropsWithChildren<DataTextProps>) => {


    return <>{props.children}</>;
};
