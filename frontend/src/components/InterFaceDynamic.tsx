import styled from 'styled-components';
import { View, Text, StyleSheet } from 'react-native';

export const ExerciseContainer = styled.div`
    padding: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const QuestionText = styled.div`
    font-size: 18px;
    margin-bottom: 20px;
    line-height: 1.5;
    color: #000;
`;

export const InputGroup = styled.div`
    margin-bottom: 15px;
    background-color: #fff;
`;

export const Label = styled.label`
    display: inline-block;
    margin-bottom: 5px;
    background-color: #fff;
    color: #000;
    margin-right: 20px;
`;

export const Input = styled.input`
    width: 10%;
    padding: 8px;
    border: 1px solid #000;
    border-radius: 4px;
    font-size: 16px;
    background-color: #fff;
    color: #000;

    /* Remove spinners */
    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    -moz-appearance: textfield;
`;

export const SubmitButton = styled.button`
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
    height: 40px;

    &:hover {
        background-color: #1976d2;
    }

    &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
        &:hover {
            background-color: #cccccc;
        }
    }
`;

export const ResultContainer = styled.div`
    margin-top: 20px;
    padding: 15px;
    border-radius: 4px;
    background-color: #f5f5f5;
    color: #000;
`;

export const ResultTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background-color: white;
    font-size: 16px;
`;

export const TableHeader = styled.th`
    padding: 12px;
    border: 1px solid #666;
    background-color: #f5f5f5;
    text-align: center;
    font-weight: bold;
`;

export const TableCell = styled.td`
    padding: 12px;
    border: 1px solid #666;
    text-align: center;
`;

export const ContentCell = styled(TableCell)`
    text-align: left;
`;

export const TableRow = styled.tr`
    &:last-child {
        background-color: #f5f5f5;
        font-weight: bold;
    }
`;

export const TotalCell = styled(TableCell)`
    text-align: right;
`;

export const CorrectAnswer = styled.span`
    color: #4caf50;
    font-weight: bold;
`;

export const WrongAnswer = styled.span`
    color: #f44336;
    font-weight: bold;
`;

export const NewQuestionButton = styled.button`
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 20px;
    height: 40px;
    &:hover {
        background-color: #1976d2;
    }
`;

export const BackButton = styled.button`
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 20px;

    &:hover {
        background-color: #1976d2;
    }
`;

export const ButtonContainer = styled.div`
    display: flex;
    gap: 10px;
    margin-top: 20px;
`;

export const Hint = styled.span`
    font-size: 14px;
    color: #666;
    margin-left: 10px;
    opacity: 0;
    transition: opacity 0.2s ease;

    &.hint {
        opacity: 1;
    }
`;

export const PopupOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

export const PopupContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 400px;
    color: #000;
    width: 90%;
`;

export const TimerDisplay = styled.div<{ isWarning?: boolean }>`
    font-size: 24px;
    font-weight: bold;
    color: ${props => props.isWarning ? '#f44336' : '#2196f3'};
    margin-bottom: 20px;
    transition: color 0.3s ease;
`;

export const ScoreCell = styled(TableCell)<{ score?: number }>`
    color: ${props => {
        if (props.score === undefined) return 'inherit';
        if (props.score < 4) return '#ff0000';
        if (props.score <= 5.5) return '#ffa500';
        return '#008000';
    }};
    font-weight: bold;
`;
const UnorderedListExample = () => {
  const items = ['a', 'b', 'c'];

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>{'\u2022'}</Text>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 20,
    marginRight: 8,
  },
  itemText: {
    fontSize: 16,
  },
});

export default UnorderedListExample;
