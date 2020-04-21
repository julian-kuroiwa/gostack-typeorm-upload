import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();
    const findCategory = await categoryRepository.findOne({
      where: { category },
    });

    let categoryId;

    if (!findCategory) {
      const newCategory = await categoryRepository.create({ title: category });

      await categoryRepository.save(newCategory);
      categoryId = newCategory.id;
    } else {
      categoryId = findCategory.id;
    }

    if (type === 'outcome' && total < value) {
      throw new AppError('Transaction exceed your limit', 400);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryId,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
