import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { WithTranslation, withTranslation } from 'react-i18next';
import { useRecoilState, useRecoilValue } from 'recoil';
import { IconContext } from 'react-icons';

import { MdClose } from 'react-icons/md';
import { HiArrowRight } from 'react-icons/hi';
import { AiOutlineRotateLeft } from 'react-icons/ai';

import doublestacker from '@/assets/icons/doublestacker.svg';

import { taskActions, taskState, systemState, taskSelectors } from '@/store';
import api from '@/api';
import styles from '@/styles/styles';
import { toFrontEndBoxes } from '@/util/coordinateChange';
import { isValidNumber } from '@/util/validation';

import { debounce } from 'lodash';

import Button from '@/components/common/buttons/Button';
import Field from '@/components/common/Field';
import NumberInput from '@/components/common/input/NumberInput';
import Row from '@/components/common/Row';
import Column from '@/components/common/Column';
import Section from '@/components/common/Section';
import Toggle from '@/components/common/Toggle';
import TriToggle from '@/components/common/TriToggle';

const Wrapper = styled.div`
  padding-left: 80px;
`;
const BoxSizeInputDividerContainer = styled.div`
  padding: 16px;
`;
const BoxSizeInputContainer = styled.div`
  display: flex;
`;

const ValidationText = styled.div`
  color: ${styles.colors.danger1};
  margin-top: 8px;
  font-size: 20px;

  &:first-child {
    margin-top: 24px;
  }
`;
const OptionText = styled.div`
  color: ${styles.colors.gray3};
  font-size: 20px;
  font-weight: 800;
  margin-top: 10px;
`;
// grilled
const _toValidatePatternPayload = (system: any, task: any) => {
  let pallet_width = task.palletDimension.width;
  let pallet_height = task.palletDimension.height;
  let box_width = parseInt(task.boxDimension.width);
  let box_height = parseInt(task.boxDimension.height);
  let layout = task.layout;
  let overHang = system.overHang;
  let full_width = pallet_width + 2 * overHang;
  let full_height = pallet_height + 2 * overHang;

  let boxes = layout.map((box: any) => ({
    xCenter: box.rotated ? box.x + box_height / 2 : box.x + box_width / 2,
    yCenter:
      full_height -
      (box.rotated ? box.y + box_width / 2 : box.y + box_height / 2),
    widthX: box.rotated ? box_height : box_width,
    heightY: box.rotated ? box_width : box_height,
  }));

  return { boxes };
};
//TODO verification

// end grilled
const BoxDetailSection = ({ t }: WithTranslation) => {
  const [task, setTask] = useRecoilState(taskState);
  const system = useRecoilValue(systemState);
  const { boxDimension, stackHeight } = task;
  const { boxMinWidth, boxMinHeight, boxMaxWidth, boxMaxHeight } = system;
  const [patternIdInput, setPatternIdInput] = useState('Pattern 1.1');

  // validation
  const [widthTouched, setWidthTouched] = useState(false);
  const [heightTouched, setHeightTouched] = useState(false);
  const [stackHeightTouched, setStackHeightTouched] = useState(false);
  const [patterns, setPatterns] = useState([]);

  const widthRequired: boolean = useRecoilValue(taskSelectors.isWidthNotEmpty);
  const widthInRange: boolean = useRecoilValue(taskSelectors.isWidthInRange);
  const heightRequired: boolean = useRecoilValue(
    taskSelectors.isHeightNotEmpty
  );
  const heightInRange: boolean = useRecoilValue(taskSelectors.isHeightInRange);
  const stackHeightRequired: boolean = useRecoilValue(
    taskSelectors.isStackHeightNotEmpty
  );
  const patternRequired: boolean = useRecoilValue(
    taskSelectors.isPatternNotEmpty
  );

  const getPatterns = () => {
    if (
      !isNaN(parseInt(boxDimension.width)) &&
      !isNaN(parseInt(boxDimension.height))
    ) {
      api
        .post('/load/all-patterns', {
          widthX: parseInt(boxDimension.width),
          heightY: parseInt(boxDimension.height),
        })
        .then((res) => {
          setPatterns(res.data.patterns);
        })
        .catch((err) => {});
    }
  };

  useEffect(() => {
    getPatterns();
  }, [boxDimension.width, boxDimension.height]);

  useEffect(() => {
    taskActions.setPatternList(task, setTask, patterns);
  }, [patterns]);

  const valid =
    widthRequired &&
    widthInRange &&
    heightRequired &&
    heightInRange &&
    stackHeightRequired &&
    patternRequired;

  const onWidthChange = (value: string) => {
    if (!isValidNumber(value) && value !== '') return;
    taskActions.setBoxWidth(task, setTask, value);
  };

  const onHeightChange = (value: string) => {
    if (!isValidNumber(value) && value !== '') return;
    taskActions.setBoxHeight(task, setTask, value);
  };

  const onStackHeightChange = (value: string) => {
    if (!isValidNumber(value) && value !== '') return;

    taskActions.setStackHeight(task, setTask, value);
  };

  const next = () => {
    // grilled
    let payloadPattern = _toValidatePatternPayload(system, task);

    api
      .post('/validate/pattern', payloadPattern)
      .then((res) => {
        taskActions.setPayloadPattern(task, setTask, payloadPattern, res.data.stackHeightLimit);
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data.message);
          console.log(err.response.status);
          console.log(err.response.headers);
        }
        console.log(err);
      });
    // end grilled
  };

  // const onPickAngleChange = () => {
  //   taskActions.setIsPickSpecial(task, setTask, !task.isPickSpecial);
  // };
  const onPickAngleChange = (value) => {
    taskActions.setIsPickSpecial(
      task,
      setTask,
      value == 1 || value == 2,
      value == 2
    );
  };
  const onRobotSpeedChange = (value) => {
    taskActions.setRobotSpeed(
      task,
      setTask,
      value
    );
  };
  const onRotateChange = () => {
    taskActions.setIsRotate(task, setTask, !task.isRotate);
  };

  const loadPattern = () => {
    let payloadPattern = {
      patternId: patternIdInput,
      boxSize: {
        widthX: boxDimension.width,
        heightY: boxDimension.height,
      },
    };

    api
      .post('/load/pattern', payloadPattern)
      .then((res) => {
        let resData = res.data;
        let boxes = toFrontEndBoxes(system, task, resData.patternBox);

        taskActions.setLayout(task, setTask, boxes);
      })
      .catch((err) => {
        if (err.response) {
          alert(err.response.data.message);
          console.log(err.response.status);
          console.log(err.response.headers);
        }
        console.log(err);
      });
  };

  return (
    <Wrapper>
      <h1>{t('taskbuilder.pattern.title')}</h1>
      <Section>
        <Field
          label={t('taskbuilder.pattern.boxdetail.size.label')}
          slot={
            <BoxSizeInputContainer>
              <NumberInput
                value={boxDimension.width}
                label={t('taskbuilder.pattern.boxdetail.size.width')}
                placeholder={`${boxMinWidth} - ${boxMaxWidth}`}
                onChange={onWidthChange}
                onBlur={() => setWidthTouched(true)}
                onFocus={() => setWidthTouched(false)}
                error={widthTouched && (!widthRequired || !widthInRange)}
              />

              <BoxSizeInputDividerContainer>
                <IconContext.Provider
                  value={{
                    style: {
                      color: `${styles.colors.gray4}`,
                      width: '36px',
                      height: '36px',
                    },
                  }}
                >
                  <MdClose />
                </IconContext.Provider>
              </BoxSizeInputDividerContainer>

              <NumberInput
                value={boxDimension.height}
                label={t('taskbuilder.pattern.boxdetail.size.height')}
                placeholder={`${boxMinWidth} - ${boxMaxWidth}`}
                onChange={onHeightChange}
                onBlur={() => setHeightTouched(true)}
                onFocus={() => setHeightTouched(false)}
                error={heightTouched && (!heightRequired || !heightInRange)}
              />
            </BoxSizeInputContainer>
          }
        />
        <Field
          label={t('taskbuilder.pattern.boxdetail.stackheight.label')}
          slot={
            <NumberInput
              value={stackHeight}
              label={t('taskbuilder.pattern.boxdetail.stackheight.height')}
              onChange={onStackHeightChange}
              onBlur={() => setStackHeightTouched(true)}
              onFocus={() => setStackHeightTouched(false)}
              error={stackHeightTouched && !stackHeightRequired}
            />
          }
        />
      </Section>
       {/* <Row>
        <Field
          label={t('taskbuilder.pattern.boxdetail.pick.label')}
          slot={
            <Toggle
              offLabel={t('taskbuilder.pattern.boxdetail.pick.normal')}
              onLabel={t('taskbuilder.pattern.boxdetail.pick.sideway')}
              offValue={false}
              onValue={true}
              selected={task.isPickSpecial}
              onToggle={onPickAngleChange}
            />
            // <TriToggle
            //   label_0={""}
            //   label_1={t('taskbuilder.pattern.boxdetail.pick.sideway')}
            //   label_2={t('taskbuilder.pattern.boxdetail.pick.no_tying')}
            //   value_0={0}
            //   value_1={1}
            //   value_2={2}
            //   selected={task.isNoTying ? 2 : task.isPickSpecial ? 1 : 0}
            //   onToggle={onPickAngleChange}
            // />
          }
        />
      </Row> */}
       {/* <Row>
        <Field
          label={t('taskbuilder.pattern.boxdetail.robot_speed.label')}
          slot={
            <TriToggle
              label_0={t('taskbuilder.pattern.boxdetail.robot_speed.auto')}
              label_1={t('taskbuilder.pattern.boxdetail.robot_speed.fast')}
              label_2={t('taskbuilder.pattern.boxdetail.robot_speed.slow')}
              value_0={0}
              value_1={1}
              value_2={2}
              selected={task.robotSpeed}
              onToggle={onRobotSpeedChange}
            />
          }
        />
      </Row> */}
      <Row>
        {/* <>
          <OptionText>
            {t('taskbuilder.pattern.boxdetail.rotateodd')}
          </OptionText>

          <IconContext.Provider
            value={{
              style: {
                width: '100px',
                height: '100px',
                color: styles.colors.gray3,
                marginLeft: 45,
                marginRight: 30,
              },
            }}
          >
            <AiOutlineRotateLeft />
          </IconContext.Provider> */}
          <Field
            label={t('taskbuilder.pattern.boxdetail.rotateodd')}
            slot={
              <Toggle
                offLabel={t('common.no')}
                onLabel={t('common.yes')}
                offValue={false}
                onValue={true}
                selected={task.isRotate}
                onToggle={onRotateChange}
              />
            }
          />
        {/* </> */}
      </Row>
      {/* <Row>
        {parseInt(stackHeight) < 140 && (
          <>
           <OptionText>{t('taskbuilder.pattern.doublestacker')}</OptionText>
            <img src={doublestacker} width={150} />
            <Field
              label={''}
              slot={
                <Toggle
                  offLabel={t('common.no')}
                  onLabel={t('common.yes')}
                  offValue={false}
                  onValue={true}
                  selected={task.isDoubleStack}
                  onToggle={(value: boolean) =>
                    taskActions.setIsDoubleStack(
                      task,
                      setTask,
                      !task.isDoubleStack
                    )
                  }
                />
              }
            />
          </>
        )}
      </Row> */}
      <Row style={{ paddingTop: '24px' }}>
        <Button
          label={t('common.next')}
          rearIcon={<HiArrowRight />}
          onTap={next}
          disabled={!valid}
        />
      </Row>
      <Row>
        <Column>
          {widthTouched && !widthRequired && (
            <ValidationText>
              {t('validation.common.required').replace(
                '{field}',
                t('common.width')
              )}
            </ValidationText>
          )}
          {widthTouched && widthRequired && !widthInRange && (
            <ValidationText>
              {t('validation.common.outofrange').replace(
                '{field}',
                t('common.width')
              )}
            </ValidationText>
          )}
          {heightTouched && !heightRequired && (
            <ValidationText>
              {t('validation.common.required').replace(
                '{field}',
                t('common.height')
              )}
            </ValidationText>
          )}
          {heightTouched && heightRequired && !heightInRange && (
            <ValidationText>
              {t('validation.common.outofrange').replace(
                '{field}',
                t('common.height')
              )}
            </ValidationText>
          )}
          {stackHeightTouched && !stackHeightRequired && (
            <ValidationText>
              {t('validation.common.required').replace(
                '{field}',
                t('common.stackheight')
              )}
            </ValidationText>
          )}
          {widthTouched &&
            heightTouched &&
            stackHeightTouched &&
            !patternRequired && (
              <ValidationText>
                {t('validation.template.required')}
              </ValidationText>
            )}
        </Column>
      </Row>
      {/*<Row style={{paddingTop: '24px'}}>
            <Field
              label="Pattern"
              slot={
                <input value={patternIdInput} onChange={e=>setPatternIdInput(e.target.value)} style={{fontSize: '1.5em', margin: '0.5em', width: '350px', backgroundColor: '#ddd'}}/>
              }
            />
            <Button
              label="Load pattern"
              // rearIcon={<HiArrowRight />}
              onTap={loadPattern}
            />
            </Row>*/}
    </Wrapper>
  );
};

export default withTranslation()(BoxDetailSection);
