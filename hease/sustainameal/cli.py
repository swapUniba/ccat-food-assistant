import argparse
from HeASe.sustainameal import SustainaMeal
import pandas as pd


def init_sustainameal(args):
    if args.load:
        sm = SustainaMeal(
            None,  # Nessun DataFrame necessario in questo caso
            args.nutrients,
            True,
            args.model_name,

        )
    else:
        recipes_df = pd.read_csv(args.recipes_csv)
        sm = SustainaMeal(
            recipes_df,
            args.nutrients,
            False,
            args.model_name,
        )
    return sm


def find_similar(args, sm):
    return sm.find_similar_recipes(args.recipe_name, args.k, args.acceptable_tags, args.match_all_tags,
                                   args.check_sustainability)


def order_by_healthiness(args, sm):
    sm.find_similar_recipes(args.recipe_name, args.k, args.acceptable_tags, args.match_all_tags,
                            args.check_sustainability)
    return sm.order_recipe_by_healthiness(score=args.score)


def order_by_sustainability(args, sm):
    sm.find_similar_recipes(args.recipe_name, args.k, args.acceptable_tags, args.match_all_tags,
                            args.check_sustainability)
    return sm.order_recipe_by_sustainability(score=args.score, secondary_sort_field=args.secondary_sort_field)


def order_by_sustainameal(args, sm):
    sm.find_similar_recipes(args.recipe_name, args.k, args.acceptable_tags, args.match_all_tags,
                            args.check_sustainability)
    return sm.order_recipe_by_sustainameal(alpha=args.alpha, beta=args.beta)


def main():
    parser = argparse.ArgumentParser(description="SustainaMeal Command Line Interface")
    parser.add_argument("--load", action="store_true", help="Load processed data from saved files")
    parser.add_argument("--recipes_csv", help="Path to the CSV file containing the recipes", default=None)
    parser.add_argument("--nutrients",
                        default=['calories [cal]', 'totalFat [g]', 'saturatedFat [g]', 'cholesterol [mg]',
                                 'sodium [mg]', 'dietaryFiber [g]',
                                 'sugars [g]', 'protein [g]'], nargs='+', help="List of nutrients to consider")
    parser.add_argument("--model_name", default="davanstrien/autotrain-recipes-2451975973",
                        help="Name of the model for embeddings")

    subparsers = parser.add_subparsers(dest='command', help='sub-command help')

    # Subparser for finding similar recipes
    parser_find_similar = subparsers.add_parser('find_similar', help='Find similar recipes')
    parser_find_similar.add_argument("recipe_name", help="Name of the recipe to find similar ones for")
    parser_find_similar.add_argument("--k", type=int, default=1, help="Number of similar recipes to find")
    parser_find_similar.add_argument("--acceptable_tags",
                                     default=['appetizers', 'main-dish', 'side-dishes',
                                              'fruits', 'desserts',
                                              'breakfast', 'pasta-rice-and-grains',
                                              'beverages', 'drinks', 'pasta'],
                                     nargs='+',
                                     help="List of acceptable tags for filtering recipes")
    parser_find_similar.add_argument("--match_all_tags", type=bool, default=False, help="Whether to match all tags")
    parser_find_similar.add_argument("--check_sustainability", type=bool, default=False,
                                     help="Whether to check sustainability score")

    # Subparser for order_by_healthiness
    parser_healthiness = subparsers.add_parser('order_by_healthiness', help='Order recipes by healthiness')
    parser_healthiness.add_argument("recipe_name", help="Name of the recipe to find similar ones for")
    parser_healthiness.add_argument("--k", type=int, default=1, help="Number of similar recipes to find")
    parser_healthiness.add_argument("--acceptable_tags",
                                    default=['appetizers', 'main-dish', 'side-dishes',
                                             'fruits', 'desserts',
                                             'breakfast', 'pasta-rice-and-grains',
                                             'beverages', 'drinks', 'pasta'],
                                    nargs='+',
                                    help="List of acceptable tags for filtering recipes")
    parser_healthiness.add_argument("--match_all_tags", type=bool, default=False, help="Whether to match all tags")
    parser_healthiness.add_argument("--check_sustainability", type=bool, default=False,
                                    help="Whether to check sustainability score")
    parser_healthiness.add_argument("--score", default='who_score', help="Healthiness score to use for ordering")

    # Subparser for order_by_sustainability
    parser_sustainability = subparsers.add_parser('order_by_sustainability', help='Order recipes by sustainability')
    parser_sustainability.add_argument("recipe_name", help="Name of the recipe to find similar ones for")
    parser_sustainability.add_argument("--k", type=int, default=1, help="Number of similar recipes to find")
    parser_sustainability.add_argument("--acceptable_tags",
                                    default=['appetizers', 'main-dish', 'side-dishes',
                                             'fruits', 'desserts',
                                             'breakfast', 'pasta-rice-and-grains',
                                             'beverages', 'drinks', 'pasta'],
                                    nargs='+',
                                    help="List of acceptable tags for filtering recipes")
    parser_sustainability.add_argument("--match_all_tags", type=bool, default=False, help="Whether to match all tags")
    parser_sustainability.add_argument("--check_sustainability", type=bool, default=False,
                                    help="Whether to check sustainability score")
    parser_sustainability.add_argument("--score", default='sustainability_score',
                                       help="Sustainability score to use for ordering")
    parser_sustainability.add_argument("--secondary_sort_field", default='who_score', help="Secondary sorting field")

    # Subparser for order_by_sustainameal
    parser_sustainameal = subparsers.add_parser('order_by_sustainameal', help='Order recipes by SustainaMeal score')
    parser_sustainameal.add_argument("recipe_name", help="Name of the recipe to find similar ones for")
    parser_sustainameal.add_argument("--k", type=int, default=1, help="Number of similar recipes to find")
    parser_sustainameal.add_argument("--acceptable_tags",
                                    default=['appetizers', 'main-dish', 'side-dishes',
                                             'fruits', 'desserts',
                                             'breakfast', 'pasta-rice-and-grains',
                                             'beverages', 'drinks', 'pasta'],
                                    nargs='+',
                                    help="List of acceptable tags for filtering recipes")
    parser_sustainameal.add_argument("--match_all_tags", type=bool, default=False, help="Whether to match all tags")
    parser_sustainameal.add_argument("--check_sustainability", type=bool, default=False,
                                    help="Whether to check sustainability score")
    parser_sustainameal.add_argument("--alpha", type=float, default=0.7, help="Weight for sustainability score")
    parser_sustainameal.add_argument("--beta", type=float, default=0.3, help="Weight for healthiness score")

    args = parser.parse_args()

    if args.command:
        sm = init_sustainameal(args)

        if args.command == 'find_similar':
            result = find_similar(args, sm)

        elif args.command == 'order_by_healthiness':
            result = order_by_healthiness(args, sm)

        elif args.command == 'order_by_sustainability':
            result = order_by_sustainability(args, sm)

        elif args.command == 'order_by_sustainameal':
            result = order_by_sustainameal(args, sm)

        else:
            parser.print_help()
            return

        # Stampa i risultati
        print(result)


if __name__ == "__main__":
    main()
