import { categoryApi } from "./api";

// 模拟分类数据，实际项目中应从API获取
export const defaultCategories = [
  { id: 1, name: "急救技能", description: "紧急医疗救护技能和知识" },
  { id: 2, name: "护理技能", description: "专业护理技能和知识" },
  { id: 3, name: "诊断技术", description: "医学诊断技术和方法" },
  { id: 4, name: "手术技能", description: "手术相关技能和知识" },
  { id: 5, name: "沟通技巧", description: "医患沟通和人际交往技巧" },
  { id: 6, name: "传染病防控", description: "传染病预防与控制知识" },
];

/**
 * 根据分类ID获取分类名称
 * @param categoryId 分类ID
 * @returns 分类名称，如果未找到则返回"未分类"
 */
export function getCategoryNameById(categoryId: number): string {
  const category = defaultCategories.find(cat => cat.id === categoryId);
  return category ? category.name : "未分类";
}

/**
 * 从API获取所有分类
 * @returns 分类列表
 */
export async function fetchCategories() {
  try {
    const response = await categoryApi.getCategories();
    if (response.data.code === 200) {
      return response.data.data;
    }
    return defaultCategories;
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return defaultCategories;
  }
}

/**
 * 从API获取特定分类
 * @param id 分类ID
 * @returns 分类信息
 */
export async function fetchCategoryById(id: number) {
  try {
    const response = await categoryApi.getCategoryById(id);
    if (response.data.code === 200) {
      return response.data.data;
    }
    return defaultCategories.find(cat => cat.id === id);
  } catch (error) {
    console.error(`获取分类ID=${id}失败:`, error);
    return defaultCategories.find(cat => cat.id === id);
  }
} 