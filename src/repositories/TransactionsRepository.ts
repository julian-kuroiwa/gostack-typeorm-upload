import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const reducedValue = (type: string): number => {
      return transactions
        .filter(transaction => transaction.type === type)
        .reduce((acc, actual) => acc + actual.value, 0);
    };

    const income = reducedValue('income');
    const outcome = reducedValue('outcome');

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
