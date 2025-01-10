import { TodoList } from "@/components/TodoList";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-secondary-blue/20 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <TodoList />
    </div>
  );
};

export default Index;