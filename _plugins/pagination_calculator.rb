module Jekyll
  module PaginationCalculator
    def starting_posts_num(item)
      end_num = item.to_i * 10
      end_num - 9
    end

    def ending_posts_num(item)
      item.to_i * 10
    end

    def add_starting_num(item, starting_num)
      item.to_i + starting_num.to_i - 1
    end
  end
end

Liquid::Template.register_filter(Jekyll::PaginationCalculator)
